import { create } from 'zustand';
import type { IRepository } from '@/shared/api/core/IRepository';
import type { UserDTO } from '@/shared/api/mock/types';
import { createMockRepository } from '@/shared/api/core/MockRepository';
import { useUserStore } from '@/entities/user/model/useUserStore';
import { tgService } from '@/shared/lib/telegram/telegram';

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

export const useInitStore = create<InitStore>((set) => ({
  status: 'checking',
  api: null,
  setApi: (api) => set({ api }),
  setStatus: (status) => set({ status }),

  initialize: async () => {
    // Вспомогательная функция для корректного запуска мок-режима
    const startMockMode = async (tgUser?: any) => {
      const fallbackApi = createMockRepository(tgUser ? {
        id: tgUser.id.toString(),
        telegramId: tgUser.id.toString(),
        firstName: tgUser.first_name || 'Пользователь',
        photoUrl: tgUser.photo_url || undefined
      } : undefined);

      const mockUser = await fallbackApi.getUserByTelegramId(tgUser?.id?.toString() || 'demo_user');
      if (mockUser) {
        useUserStore.getState().setCurrentUser(mockUser);
      }
      set({ status: 'browser_mock', api: fallbackApi });
    };

    const inTMA = await tgService.isAvailable();
    if (!inTMA) {
      // Обычный браузер 
      await startMockMode();
      return;
    }

    // Запуск внутри Telegram TMA
    let liveApi: IRepository;
    try {
      const { createSupabaseRepository } = await import('@/shared/api/supabase/SupabaseRepository');
      liveApi = createSupabaseRepository();
    } catch (err) {
      console.warn('Supabase не доступен или произошел сбой:', err);
      await startMockMode();
      return;
    }

    // Извлекаем информацию о пользователе Telegram
    const tgUser = tgService.getTelegramUser();
    if (!tgUser) {
      await startMockMode();
      return;
    }

    try {
      //Создаем или обновляем запись текущего пользователя в таблице users
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

      // наличие параметра перехода по инвайт-ссылке (start_param = "invite_<userId>")
      const initDataRaw = tgService.getInitData();
      let startParam = null;
      if (initDataRaw) {
         try {
            const params = new URLSearchParams(initDataRaw);
            startParam = params.get('start_param');
         } catch(e) {
          console.error('error init tg getInitData:', e)
         }
      }
      
      // Fallback на случай если SDK не вернул, а объект window.Telegram существует
      if (!startParam) {
          startParam = (window as any).Telegram?.WebApp?.initDataUnsafe?.start_param;
      }

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

      // статус наличия пары
      if (!currentUser.pairId) {
        set({ status: 'telegram_no_pair', api: liveApi });
      } else {
        set({ status: 'telegram_ready', api: liveApi });
      }

    } catch (e) {
      console.error("Init Error:", e);
      await startMockMode(tgUser);
    }
  }
}));

