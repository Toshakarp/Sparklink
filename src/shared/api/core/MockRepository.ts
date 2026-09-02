import type { IRepository, PairData } from './IRepository';
import type { UserDTO } from '../mock/types';

export const createMockRepository = (initialUserData?: Partial<UserDTO>): IRepository => {
  // Локальное in-memory состояние для имитации таблиц БД
  let currentUser: UserDTO = {
    id: initialUserData?.id || 'mock-user-1',
    telegramId: initialUserData?.telegramId || 'demo_user',
    firstName: initialUserData?.firstName || 'Алексей',
    themeColor: initialUserData?.themeColor || '#FF4B4B',
    pairId: 'mock-pair-id',
    moodId: 'happy',
    energyLevel: 80,
    lockitPhotoUrl: null,
    photoUrl: initialUserData?.photoUrl,
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
    getUserByTelegramId: async (_telegramId) => {
      await new Promise((r) => setTimeout(r, 200));
      return currentUser;
    },

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

    getPartner: async (_pairId, _currentUserId) => {
      await new Promise((r) => setTimeout(r, 200));
      return partnerUser;
    },

    getPairData: async (_pairId): Promise<PairData> => {
      await new Promise((r) => setTimeout(r, 200));
      return {
        places: [
          { 
            id: '1', 
            title: 'Ресторан "Маяк"', 
            emoji: '🍷', 
            address: 'Приморский бульвар, 14',
            description: 'Уютный столик с видом на закат, заказать морские деликатесы',
            clickCount: 2, 
            categoryIds: ['dates'], 
            tagIds: ['dates'], 
            budgetId: 'mid', 
            lastClickedAt: null 
          },
          { 
            id: '2', 
            title: 'Гончарная мастерская', 
            emoji: '🎨', 
            address: 'ул. Творческая, 5',
            description: 'Мастер-класс по лепке парной посуды из глины',
            clickCount: 0, 
            categoryIds: ['activities'], 
            tagIds: ['activities'], 
            budgetId: 'low', 
            lastClickedAt: null 
          }
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

    createPlace: async (_pairId, placeData) => {
      await new Promise((r) => setTimeout(r, 100));
      return {
        id: `mock-place-${Date.now()}`,
        title: placeData.title,
        emoji: placeData.emoji,
        address: placeData.address,
        description: placeData.description,
        categoryIds: placeData.categoryIds || [],
        tagIds: placeData.categoryIds || [],
        budgetId: placeData.budgetId,
        clickCount: 0,
        lastClickedAt: null,
        createdAt: new Date().toISOString(),
      };
    },

    updatePlace: async (_place) => {
      await new Promise((r) => setTimeout(r, 100));
    },

    deletePlace: async (_placeId) => {
      await new Promise((r) => setTimeout(r, 100));
    },

    updateUserMood: async (userId, energy, moodId) => {
      await new Promise((r) => setTimeout(r, 200));
      if (userId === currentUser.id) {
        currentUser.energyLevel = energy;
        if (moodId) currentUser.moodId = moodId;
      }
    },

    updateLockitPhoto: async (userId, photoUrl) => {
      await new Promise((r) => setTimeout(r, 200));
      if (userId === currentUser.id) {
        currentUser.lockitPhotoUrl = photoUrl;
      }
    },

    createPairWithInvite: async (_inviterParam, _currentUserId) => {
      await new Promise((r) => setTimeout(r, 300));
      const pairId = 'mock-pair-id';
      currentUser.pairId = pairId;
      partnerUser.pairId = pairId;
      return { pairId, partner: partnerUser };
    }
  };
};

