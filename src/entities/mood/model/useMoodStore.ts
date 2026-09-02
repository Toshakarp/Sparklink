import { create } from 'zustand';
import type { MoodStatusDTO, UserDTO } from '@/shared/api/mock/types';
import { DEFAULT_EMOTIONS } from '@/shared/config/constants';
import { tgService } from '@/shared/lib/telegram/telegram';

export interface MoodState {
  myMood: MoodStatusDTO | null;
  partnerMood: MoodStatusDTO | null;
  isLoading: boolean;
  fetchMoods: (currentUser?: UserDTO | null, partnerUser?: UserDTO | null) => void;
  setMyMood: (mood: MoodStatusDTO | null) => void;
}

// Чистый маппер из UserDTO в модель MoodStatusDTO
export const mapUserToMood = (user: UserDTO | null): MoodStatusDTO | null => {
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

