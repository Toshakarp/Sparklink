import { create } from 'zustand';
import { moodService } from "../api/moodService";
import type { MoodStatusDTO } from '@/shared/api/mock/types';
import { DEFAULT_EMOTIONS } from '@/shared/config/constants';
import { tgService } from '@/shared/lib/telegram/telegram';

interface MoodState {
  myMood: MoodStatusDTO | null;
  partnerMood: MoodStatusDTO | null;
  isLoading: boolean;
  fetchMoods: () => Promise<void>;
  saveMood: (emotionId: string, energyLevel: number) => void;
  saveMyPhoto: (photoUrl: string) => void;
}

export const useMoodStore = create<MoodState>((set) => ({
  myMood: null,
  partnerMood: null,
  isLoading: false,

  fetchMoods: async () => {
    set({ isLoading: true });
    try {
      const [my, partner] = await Promise.all([
        moodService.getMyMood(),
        moodService.getPartnerMood()
      ]);
      set({ myMood: my, partnerMood: partner, isLoading: false });
    } catch (e) {
      console.error(e);
      set({ isLoading: false });
    }
  },

  saveMood: (emotionId, energyLevel) => {
    const emotion = DEFAULT_EMOTIONS.find((e) => e.id === emotionId);
    set((state) => ({
      myMood: state.myMood ? {
        ...state.myMood,
        emotionId,
        emotionTitle: emotion?.title || 'Радость',
        emotionEmoji: emotion?.emoji || '😊',
        energyLevel,
        updatedAt: new Date().toISOString(),
      } : null
    }));
    tgService.haptic('success');
  },

  saveMyPhoto: (photoUrl) => {
    set((state) => ({
      myMood: state.myMood ? {
        ...state.myMood,
        locketPhotoUrl: photoUrl,
        locketPhotoTime: 'Только что',
        updatedAt: new Date().toISOString(),
      } : null
    }));
    tgService.haptic('success');
  }
}));
