export interface MoodStatus {
  id: string;
  userId: string | number;
  emotionId: string;
  emotionTitle: string;
  emotionEmoji: string;
  energyLevel: number;
  locketPhotoUrl?: string | null;
  locketPhotoTime?: string | null;
  updatedAt: string | Date;
}

export interface Tag {
  id: string;
  pairId?: string | null;
  label: string;
}

export interface Emotion {
  id: string;
  title: string;
  emoji: string;
  type?: 'difficult' | 'neutral' | 'positive';
}
