import type { UserRow, PlaceRow } from '../types/database.types';
import type { User } from '@/entities/user/model/types';
import type { Place } from '@/entities/place/model/types';

export const mapUserRowToDomain = (row: UserRow): User => ({
  id: row.id,
  telegramId: row.telegram_id,
  firstName: row.first_name,
  photoUrl: row.avatar_url,
  themeColor: row.theme_color,
  moodId: row.mood_id || undefined,
  energyLevel: row.energy_level || undefined,
  pairId: row.pair_id,
  lockitPhotoUrl: row.lockit_photo_url,
  createdAt: new Date(row.created_at)
});

export const mapPlaceRowToDomain = (row: PlaceRow): Place => ({
  id: row.id,
  pairId: row.pair_id,
  title: row.title,
  emoji: row.emoji,
  address: row.address || undefined,
  description: row.description || undefined,
  categoryIds: row.category_ids || [],
  budgetId: row.budget_id || undefined,
  clickCount: row.click_count,
  lastClickedAt: row.last_clicked_at,
  createdAt: new Date(row.created_at)
});
