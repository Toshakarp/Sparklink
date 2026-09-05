import type { PlaceDTO } from '../../types/models';

export interface SupabasePlaceRow {
  id: string;
  pair_id?: string;
  title: string;
  emoji?: string;
  address?: string | null;
  description?: string | null;
  category_ids?: string[] | null;
  budget_id?: string | null;
  click_count?: number | null;
  last_clicked_at?: string | null;
  created_at?: string | null;
}

export const mapPlaceFromDb = (row: SupabasePlaceRow): PlaceDTO => ({
  id: row.id,
  pairId: row.pair_id,
  title: row.title,
  emoji: row.emoji,
  address: row.address || undefined,
  description: row.description || undefined,
  categoryIds: row.category_ids || [],
  budgetId: row.budget_id || undefined,
  clickCount: row.click_count || 0,
  lastClickedAt: row.last_clicked_at || null,
  createdAt: row.created_at || undefined,
});
