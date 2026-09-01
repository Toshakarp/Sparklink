import type { IRepository, PairData } from './IRepository';
import type { UserDTO } from '../mock/types';


export const createMockRepository = (): IRepository => {
  // Локальное in-memory состояние для имитации таблиц БД
  let currentUser: UserDTO = {
    id: 'mock-user-1',
    telegramId: 'demo_user',
    firstName: 'Антон',
    themeColor: '#FF4B4B',
    pairId: 'mock-pair-id',
    moodId: 'happy',
    energyLevel: 80,
    lockitPhotoUrl: null,
  };

  let partnerUser: UserDTO = {
    id: 'mock-user-2',
    telegramId: 'demo_partner',
    firstName: 'Мария',
    themeColor: '#4B9AFF',
    pairId: 'mock-pair-id',
    moodId: 'inspired',
    energyLevel: 90,
    lockitPhotoUrl: null,
  };

  return {
    // Поиск пользователя по Telegram ID
    getUserByTelegramId: async (_telegramId) => {
      await new Promise((r) => setTimeout(r, 200));
      return currentUser;
    },

    // Создание / обновление пользователя

    upsertUser: async (userData) => {
      await new Promise((r) => setTimeout(r, 200));
      currentUser = {
        ...currentUser,
        telegramId: userData.telegramId,
        firstName: userData.firstName,
        photoUrl: userData.photoUrl || currentUser.photoUrl,
        themeColor: userData.themeColor || currentUser.themeColor,
      };
      return currentUser;
    },

    // Получение партнера
    
    getPartner: async (_pairId, _currentUserId) => {
      await new Promise((r) => setTimeout(r, 200));
      return partnerUser;
    },

    // Загрузка списков мест, категорий и тегов
    getPairData: async (_pairId): Promise<PairData> => {
      await new Promise((r) => setTimeout(r, 200));
      return {
        places: [
          { id: '1', title: 'Ресторан "Маяк"', emoji: '🍷', clickCount: 0, categoryIds: ['dates'], budgetId: 'mid', lastClickedAt: null }
        ],
        placeCategories: [
          { id: 'dates', pair_id: 'mock-pair-id', label: 'Свидания', emoji: '🍷' },
          { id: 'activities', pair_id: 'mock-pair-id', label: 'Активности', emoji: '🎨' },
        ],
        moodTags: [
          { id: 'tag1', label: 'Хочу обнимашек', emoji: '🫂', type: 'mood' }
        ],
        budgetTiers: [
          { id: 'low', name: 'Дешево', emoji: '💸', colorLevel: 1 },
          { id: 'mid', name: 'Средне', emoji: '💰', colorLevel: 2 }
        ],
      };
    },

    // Сохранение настроения пользователя

    updateUserMood: async (userId, energy, moodId) => {
      await new Promise((r) => setTimeout(r, 200));
      if (userId === currentUser.id) {
        currentUser.energyLevel = energy;
        if (moodId) currentUser.moodId = moodId;
      }
    },

    // Сохранение фото виджета LockIt
    updateLockitPhoto: async (userId, photoUrl) => {
      await new Promise((r) => setTimeout(r, 200));
      if (userId === currentUser.id) {
        currentUser.lockitPhotoUrl = photoUrl;
      }
    },

    // Имитация создания пары по инвайт-ссылке
    createPairWithInvite: async (_inviterParam, _currentUserId) => {
      await new Promise((r) => setTimeout(r, 300));
      const pairId = 'mock-pair-id';
      currentUser.pairId = pairId;
      partnerUser.pairId = pairId;
      return { pairId, partner: partnerUser };
    }
  };
};

