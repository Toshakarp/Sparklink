import { create } from 'zustand';
import type { IRepository } from '@/shared/api/core/IRepository';
import type { UserDTO } from '@/shared/api/mock/types';
import { createMockRepository } from '@/shared/api/core/MockRepository';
import { useUserStore } from '@/entities/user/model/useUserStore';

// 'checking'         -> Идет проверка окружения и данных
// 'browser_mock'     -> Запущено в обычном браузере (включаем MockRepository и демо-режим)
// 'telegram_no_pair' -> Запущено в Telegram, но у юзера еще нет пары (показываем онбординг)
// 'telegram_ready'   -> Запущено в Telegram и пара есть (открываем основное приложение)
export type AppInitStatus = 'checking' | 'browser_mock' | 'telegram_no_pair' | 'telegram_ready';

interface InitStore {
  status: AppInitStatus;
  api: IRepository | null;
  initialize: () => Promise<void>;
  setApi: (api: IRepository) => void;
  setStatus: (status: AppInitStatus) => void;
}

// Стейт-машина
export const useInitStore = create<InitStore>((set) => ({
  status: 'checking',
  api: null,
  setApi: (api) => set({ api }),
  setStatus: (status) => set({ status }),

  initialize: async () => {
    // запущено ли приложение внутри Telegram Mini App
    const initData = (window as any).Telegram?.WebApp?.initData;

    if (!initData) {
      // Dev-режим, превью или веб-версия
      // Подключаем моковый репозиторий с локальными данными
      set({ status: 'browser_mock', api: createMockRepository() });
      return;
    }

    // Сценарий Б: Запуск внутри Telegram TMA
    let liveApi: IRepository;
    try {
      // Динамический импорт репозитория Supabase предотвращает ошибки в изолированных песочницах
      const { createSupabaseRepository } = await import('@/shared/api/supabase/SupabaseRepository');
      liveApi = createSupabaseRepository();
    } catch (err) {
      console.warn('Supabase не доступен или произошел сбой:', err);
      set({ status: 'browser_mock', api: createMockRepository() });
      return;
    }

    // Извлекаем информацию о пользователе Telegram из WebApp initDataUnsafe
    const tgUser = (window as any).Telegram?.WebApp?.initDataUnsafe?.user;

    if (!tgUser) {
      // Fallback на случай, если Telegram SDK вернул пустой объект
      set({ status: 'browser_mock', api: createMockRepository() });
      return;
    }

    try {
      // 2. Создаем или обновляем запись текущего пользователя в таблице users
      const currentUser: UserDTO = liveApi.upsertUser
        ? await liveApi.upsertUser({
            telegramId: tgUser.id.toString(),
            firstName: tgUser.first_name || 'Пользователь',
            photoUrl: tgUser.photo_url || null,
          })
        : (await liveApi.getUserByTelegramId(tgUser.id.toString())) || {
            id: tgUser.id.toString(),
            telegramId: tgUser.id.toString(),
            firstName: tgUser.first_name || 'Пользователь',
            themeColor: '#FF4B4B',
            pairId: null,
          };

      useUserStore.getState().setCurrentUser(currentUser);

      //Проверяем наличие start_param = "invite_<userId>"
      const startParam = (window as any).Telegram?.WebApp?.initDataUnsafe?.start_param;

      if (startParam && startParam.startsWith('invite_') && !currentUser.pairId) {
        const inviterParam = startParam.replace('invite_', '');
        try {
          // Если пользователь перешел по ссылке партнера — связываем их в пару
          if (liveApi.createPairWithInvite) {
            const { pairId, partner } = await liveApi.createPairWithInvite(inviterParam, currentUser.id);
            currentUser.pairId = pairId;
            useUserStore.getState().setCurrentUser(currentUser);
            if (partner) {
              const { usePairStore } = await import('@/entities/pair/model/usePairStore');
              usePairStore.getState().setPartnerUser(partner);
            }
          }
        } catch (linkErr) {
          console.warn('Ошибка автоматической привязки по ссылке:', linkErr);
        }
      }

      // 4. Проверяем статус наличия пары
      if (!currentUser.pairId) {
        // У пользователя еще нет пары -> отправляем на экран приглашения
        set({ status: 'telegram_no_pair', api: liveApi });
      } else {
        // Пара успешно установлена -> открываем главное пространство пары
        set({ status: 'telegram_ready', api: liveApi });
      }
    } catch (e) {
      console.error("Init Error:", e);
      // Если БД недоступна — активируем моки, чтобы избежать падения приложения
      set({ status: 'browser_mock', api: createMockRepository() });
    }
  }
}));

