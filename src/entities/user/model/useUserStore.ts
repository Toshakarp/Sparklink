import { create } from 'zustand';
import { userApi } from '../api/userApi';
import type { UserDTO, AppearanceSettingsDTO, NotificationSettingsDTO } from '@/shared/api/mock/types';
import { tgService } from '@/shared/lib/telegram/telegram';

interface UserState {
  currentUser: UserDTO | null;
  appearance: AppearanceSettingsDTO;
  notifications: NotificationSettingsDTO;
  isLoading: boolean;
  isAuth: boolean;
  isDemo: boolean;
  fetchUser: (isDemo?: boolean) => Promise<void>;
  setAuth: (isAuth: boolean, isDemo?: boolean) => void;
  updateAppearance: (settings: AppearanceSettingsDTO) => void;
  updateNotifications: (settings: NotificationSettingsDTO) => void;
  resetUser: () => void;
  logout: () => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  currentUser: null,
  appearance: { accentColor: '#ff2d55', theme: 'dark' },
  notifications: {
    partnerAttention: true,
    moodUpdates: true,
    newLockItPhotos: true,
    dateMatches: true,
    soundAndHaptics: true,
  },
  isLoading: false,
  isAuth: false,
  isDemo: false,

  fetchUser: async (isDemo = false) => {
    set({ isLoading: true });
    try {
      const user = await userApi.getCurrentUser(isDemo || get().isDemo);
      set({
        currentUser: user,
        appearance: { ...get().appearance, accentColor: user.themeColor },
        isLoading: false,
      });
      if (user.themeColor) {
        document.documentElement.style.setProperty('--accent-color', user.themeColor);
        document.documentElement.style.setProperty('--my-color', user.themeColor);
      }
    } catch {
      set({ isLoading: false });
    }
  },

  setAuth: (isAuth: boolean, isDemo = false) => {
    set({ isAuth, isDemo });
  },

  updateAppearance: (settings) => {
    set((state) => ({
      appearance: settings,
      currentUser: state.currentUser ? {
        ...state.currentUser,
        themeColor: settings.accentColor,
      } : null
    }));
    if (settings.accentColor) {
      document.documentElement.style.setProperty('--accent-color', settings.accentColor);
      document.documentElement.style.setProperty('--my-color', settings.accentColor);
    }
    userApi.updateAppearance(settings);
    tgService.haptic('success');
  },

  updateNotifications: (settings) => {
    set({ notifications: settings });
    userApi.updateNotifications(settings);
    tgService.haptic('success');
  },

  resetUser: () => {
    set({
      appearance: { accentColor: '#ff2d55', theme: 'dark' },
      notifications: {
        partnerAttention: true,
        moodUpdates: true,
        newLockItPhotos: true,
        dateMatches: true,
        soundAndHaptics: true,
      }
    });
    tgService.haptic('warning');
  },

  logout: () => {
    set({
      currentUser: null,
      isAuth: false,
      isDemo: false,
    });
    tgService.haptic('warning');
  },
}));

