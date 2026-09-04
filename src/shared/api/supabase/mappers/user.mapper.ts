import type { UserDTO } from '../../types/models';

export interface SupabaseUserRow {
  id: string;
  telegram_id: string;
  first_name: string;
  avatar_url?: string | null;
  theme_color: string;
  mood_id?: string | null;
  energy_level?: number | null;
  pair_id?: string | null;
  lockit_photo_url?: string | null;
  lockit_updated_at?: string | null;
  created_at?: string | null;
}

export const mapUserFromDb = (row: SupabaseUserRow): UserDTO => ({
  id: row.id,
  telegramId: row.telegram_id,
  firstName: row.first_name,
  photoUrl: row.avatar_url,
  themeColor: row.theme_color,
  moodId: row.mood_id,
  energyLevel: row.energy_level,
  pairId: row.pair_id,
  lockitPhotoUrl: row.lockit_photo_url,
  lockitUpdatedAt: row.lockit_updated_at,
  createdAt: row.created_at ?? undefined,
});
