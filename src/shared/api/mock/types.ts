export interface UserDTO {
  id: string | number;
  telegramId: number;
  firstName: string;
  lastName?: string;
  username?: string;
  photoUrl?: string | null;
  themeColor: string;
  notificationsEnabled?: boolean;
}

export interface MoodStatusDTO {
  id: string;
  userId: string | number;
  emotionId: string;
  emotionTitle: string;
  emotionEmoji: string;
  energyLevel: number; // 0..100
  locketPhotoUrl?: string | null;
  locketPhotoTime?: string | null;
  updatedAt: string;
}

export interface PairDTO {
  id: string;
  partner: UserDTO;
  togetherSince: string;
  isSync: boolean;
  lastSyncedAt: string;
  lockItPhoto?: {
    url: string;
    updatedAt: string;
    authorId: string | number;
  };
}

export interface TagDTO {
  id: string;
  label: string;
  emoji: string;
  type: 'date' | 'mood';
  audience?: 'together' | 'alone';
  selectedByMe?: boolean;
  selectedByPartner?: boolean;
  markedBy?: string[];
}

export interface BudgetTierDTO {
  id: string;
  name: string;
  label?: string;
  range?: string;
  rangeLabel?: string;
  emoji: string;
  colorLevel: 1 | 2 | 3 | 4 | 5;
  minAmount?: number;
  maxAmount?: number;
}

export interface PlaceDTO {
  id: string;
  title: string;
  description: string;
  address?: string;
  emoji?: string;
  iconName?: string;
  clickCount: number;
  lastClickedAt: string | null;
  cooldownUntil?: string | null;
  tagIds: string[];
  budgetId?: string;
  createdAt?: string;
}

export interface CreatePlaceDTO {
  title: string;
  emoji: string;
  address?: string;
  description?: string;
  tagIds: string[];
  budgetId?: string;
}

export interface NotificationSettingsDTO {
  partnerAttention: boolean;
  moodUpdates: boolean;
  newLockItPhotos: boolean;
  dateMatches?: boolean;
  soundAndHaptics: boolean;
}

export interface AppearanceSettingsDTO {
  themeColor?: string;
  accentColor?: string;
  theme?: 'dark' | 'oled' | 'system';
}

export interface EmotionDTO {
  id: string;
  title: string;
  emoji: string;
  type?: 'difficult' | 'neutral' | 'positive';
}
