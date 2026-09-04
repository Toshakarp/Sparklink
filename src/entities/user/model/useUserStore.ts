import { create } from 'zustand';
import { tgService } from '@/shared/lib/telegram/telegram';
import type { UserDTO } from '@/shared/api/types/models';


export interface UserState {
  currentUser: UserDTO | null;
  isLoading: boolean;
  isAuth: boolean;
  
  updateThemeColor: (color: string) => void;
  updateLockitPhoto: (photoUrl: string) => void;
  updateMood: (emotionId: string, energyLevel: number) => void;
  updateNotifications: (enabled: boolean) => void;
  setCurrentUser: (user: UserDTO | null) => void;
}

export const useUserStore = create<UserState>((set) => ({
  currentUser: null,
  isLoading: false,
  isAuth: false,

  setCurrentUser: (user) => set({ currentUser: user, isAuth: !!user }),

  

  updateLockitPhoto: (photoUrl: string) => {
    set((state: UserState) => ({ currentUser: state.currentUser ? { ...state.currentUser, lockitPhotoUrl: photoUrl } : null }));
  },

  updateNotifications: (enabled: boolean) => { set(state => ({ currentUser: state.currentUser ? { ...state.currentUser, notificationsEnabled: enabled } : null })); },
  updateMood: (emotionId: string, energyLevel: number) => {
    set((state: UserState) => ({ currentUser: state.currentUser ? { ...state.currentUser, moodId: emotionId, energyLevel } : null }));
  },

  updateThemeColor: (color: string) => {
    set((state: UserState) => ({
      currentUser: state.currentUser ? { ...state.currentUser, themeColor: color } : null
    }));
    tgService.haptic('light');
  },
}));
