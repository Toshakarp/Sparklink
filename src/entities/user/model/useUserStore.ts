import { create } from 'zustand';
import { tgService } from '@/shared/lib/telegram/telegram';
import type { UserDTO } from '@/shared/api/mock/types';
import { useInitStore } from '@/app/model/useInitStore';

// ============================================================================
// Zustand Store: Управление текущим пользователем и его настройками
// ============================================================================

export interface UserState {
  currentUser: UserDTO | null;
  isLoading: boolean;
  isAuth: boolean;
  login: () => Promise<void>;
  updateThemeColor: (color: string) => void;
  updateNotifications: (enabled: boolean) => void;
  updateLockitPhoto: (photoUrl: string) => Promise<void>;
  updateMood: (emotionId: string, energyLevel: number) => Promise<void>;
  setCurrentUser: (user: UserDTO | null) => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  currentUser: null,
  isLoading: false,
  isAuth: false,
  
  // --------------------------------------------------------------------------
  // Установка активного пользователя и флага авторизации
  // --------------------------------------------------------------------------
  setCurrentUser: (user) => set({ currentUser: user, isAuth: !!user }),
  
  // --------------------------------------------------------------------------
  // Синхронизация данных пользователя через активный репозиторий
  // --------------------------------------------------------------------------
  login: async () => {
    set({ isLoading: true });
    try {
      const api = useInitStore.getState().api;
      if (!api) throw new Error("API не инициализирован");
      
      const tgUser = tgService.getTelegramUser();
      const tgId = tgUser?.id ? String(tgUser.id) : 'demo_user';
      
      const user = await api.getUserByTelegramId(tgId);
      set({ currentUser: user, isAuth: !!user, isLoading: false });
      tgService.haptic('success');
    } catch {
      set({ isLoading: false });
    }
  },
  
  updateLockitPhoto: async (photoUrl: string) => {
    const api = useInitStore.getState().api;
    const { currentUser } = get();
    if (api && currentUser) {
      try {
        await api.updateLockitPhoto(currentUser.id, photoUrl);
      } catch (e) {
        console.error('Failed to save lockit photo:', e);
      }
    }
    set((state) => ({
      currentUser: state.currentUser ? { ...state.currentUser, lockitPhotoUrl: photoUrl } : null
    }));
    tgService.haptic('success');
  },

  updateMood: async (emotionId: string, energyLevel: number) => {
    const api = useInitStore.getState().api;
    const { currentUser } = get();
    if (api && currentUser) {
      try {
        await api.updateUserMood(currentUser.id, energyLevel, emotionId);
      } catch (e) {
        console.error('Failed to update mood in database:', e);
      }
    }
    set((state) => ({
      currentUser: state.currentUser ? { ...state.currentUser, moodId: emotionId, energyLevel } : null
    }));
    tgService.haptic('success');
  },

  updateThemeColor: (color) => {
    set((state) => ({
      currentUser: state.currentUser ? { ...state.currentUser, themeColor: color } : null
    }));
    tgService.haptic('light');
  },
  
  updateNotifications: (enabled) => {
    set((state) => ({
      currentUser: state.currentUser ? { ...state.currentUser, notificationsEnabled: enabled } : null
    }));
    tgService.haptic('light');
  },
}));

