import type { IUserApi } from '../../core/user.api';
import type { UserDTO } from '../../types/models';
import { mockCurrentUserDTO } from '../data/user.mock';

export const createMockUserApi = (initialUserData?: Partial<UserDTO>): IUserApi => {
  let currentUser: UserDTO = { ...mockCurrentUserDTO, ...initialUserData };

  return {
    getUserByTelegramId: async () => {
      await new Promise((resolve) => setTimeout(resolve, 200));
      return currentUser;
    },

    upsertUser: async (data) => {
      await new Promise((resolve) => setTimeout(resolve, 200));
      currentUser = {
        ...currentUser,
        telegramId: data.telegramId,
        firstName: data.firstName,
        photoUrl: data.photoUrl || currentUser.photoUrl,
        themeColor: data.themeColor || currentUser.themeColor,
      };
      return currentUser;
    },

    updateUserMood: async (userId, energy, moodId) => {
      await new Promise((resolve) => setTimeout(resolve, 200));
      if (userId === currentUser.id) {
        currentUser.energyLevel = energy;
        if (moodId) {
          currentUser.moodId = moodId;
        }
      }
    },

    updateLockitPhoto: async (userId, photoUrl) => {
      await new Promise((resolve) => setTimeout(resolve, 200));
      if (userId === currentUser.id) {
        currentUser.lockitPhotoUrl = photoUrl;
      }
    },

    updateThemeColor: async (userId, color) => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      if (userId === currentUser.id) {
        currentUser.themeColor = color;
      }
    },
  };
};
