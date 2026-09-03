export interface User {
  id: string;
  telegramId: string;
  firstName: string;
  photoUrl?: string | null;
  themeColor: string;
  moodId?: string | null;
  energyLevel?: number | null;
  pairId?: string | null;
  lockitPhotoUrl?: string | null;
  lockitUpdatedAt?: Date | null;
  createdAt?: Date;
}

export interface NotificationSettings {
  partnerAttention: boolean;
  moodUpdates: boolean;
  newLockItPhotos: boolean;
  dateMatches?: boolean;
  soundAndHaptics: boolean;
}

export interface AppearanceSettings {
  themeColor?: string;
  accentColor?: string;
  theme?: 'dark' | 'oled' | 'system';
}
