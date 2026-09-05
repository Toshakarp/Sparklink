import type { UserDTO } from '@/shared/api/types/models';
import { create } from 'zustand';
import { DEFAULT_EMOTIONS } from '@/shared/config/constants';
import { tgService } from '@/shared/lib/telegram/telegram';
import type { MoodStatus } from './types';

export interface MoodState {
  myMood: MoodStatus | null;
  partnerMood: MoodStatus | null;
  isLoading: boolean;
  fetchMoods: (currentUser?: UserDTO | null, partnerUser?: UserDTO | null) => void;
  setMyMood: (mood: MoodStatus | null) => void;
}

// Чистый маппер из UserDTO в модель MoodStatus
export const mapUserToMood = (user: UserDTO | null): MoodStatus | null => {
  if (!user) return null;
  const emotion = DEFAULT_EMOTIONS.find((e) => e.id === user.moodId) || DEFAULT_EMOTIONS[0];
  return {
    id: `${user.id}_mood`,
    userId: user.id,
    emotionId: emotion.id,
    emotionTitle: emotion.title,
    emotionEmoji: emotion.emoji,
    energyLevel: user.energyLevel ?? 50,
    locketPhotoUrl: user.lockitPhotoUrl || null,
    locketPhotoTime: user.lockitPhotoUrl ? 'недавно' : null,
    updatedAt: new Date().toISOString()
  };
};

export const useMoodStore = create<MoodState>((set) => ({
  myMood: null,
  partnerMood: null,
  isLoading: false,
  
  fetchMoods: (currentUser?: UserDTO | null, partnerUser?: UserDTO | null) => {
    set({
      myMood: mapUserToMood(currentUser || null),
      partnerMood: mapUserToMood(partnerUser || null),
      isLoading: false
    });
  },
  
  setMyMood: (mood) => {
    set({ myMood: mood });
    tgService.haptic('light');
  }
}));

