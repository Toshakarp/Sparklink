export interface UserDTO {
  id: string;
  telegramId: string;
  firstName: string;
  photoUrl?: string | null;
  themeColor: string;
  moodId?: string | null;
  energyLevel?: number | null;
  pairId?: string | null;
  lockitPhotoUrl?: string | null;
  lockitUpdatedAt?: Date | string | null;
  createdAt?: Date | string;
  notificationsEnabled?: boolean;
}

export interface PlaceDTO {
  id: string;
  pairId?: string;
  title: string;
  emoji?: string;
  address?: string;
  description?: string;
  clickCount: number;
  lastClickedAt: string | null;
  categoryIds?: string[];
  budgetId?: string;
  createdAt?: Date | string;
}

export interface CreatePlaceDTO {
  title: string;
  emoji: string;
  address?: string;
  description?: string;
  categoryIds: string[];
  budgetId?: string;
}

export interface TagDTO {
  id: string;
  pairId?: string | null;
  label: string;
  emoji?: string;
  audience?: 'together' | 'alone';
}

export interface BudgetTierDTO {
  id: string;
  pairId?: string | null;
  label: string;
  emoji?: string;
  rangeLabel?: string;
  level?: number;
}

export interface DateCategoryDTO {
  id: string;
  pair_id?: string;
  label: string;
  emoji: string;
}

export interface UserMoodTagDTO {
  userId: string;
  tagId: string;
  pairId: string;
  selectedAt?: string;
}

export interface EmotionDTO {
  id: string;
  title: string;
  emoji: string;
  type: 'positive' | 'difficult' | 'neutral' | string;
}
