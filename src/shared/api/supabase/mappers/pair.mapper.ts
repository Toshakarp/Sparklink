import type {
  DateCategoryDTO,
  TagDTO,
  BudgetTierDTO,
  UserMoodTagDTO,
} from '../../types/models';

export interface SupabasePlaceCategoryRow {
  id: string;
  pair_id?: string;
  label: string;
  emoji: string;
}

export interface SupabaseMoodTagRow {
  id: string;
  pair_id?: string;
  label: string;
  emoji?: string;
  audience?: 'together' | 'alone';
}

export interface SupabaseBudgetTierRow {
  id: string;
  pair_id?: string;
  name: string;
  range_label?: string;
  emoji?: string;
  color_level?: number;
}

export interface SupabaseUserMoodTagRow {
  user_id: string;
  tag_id: string;
  pair_id: string;
  selected_at?: string;
}

export const mapCategoryFromDb = (row: SupabasePlaceCategoryRow): DateCategoryDTO => ({
  id: row.id,
  pairId: row.pair_id,
  label: row.label,
  emoji: row.emoji,
});

export const mapMoodTagFromDb = (row: SupabaseMoodTagRow): TagDTO => ({
  id: row.id,
  pairId: row.pair_id,
  label: row.label,
  emoji: row.emoji,
  audience: row.audience || 'alone',
});

export const mapBudgetTierFromDb = (row: SupabaseBudgetTierRow): BudgetTierDTO => ({
  id: row.id,
  pairId: row.pair_id,
  label: row.name,
  rangeLabel: row.range_label,
  emoji: row.emoji,
  level: row.color_level,
});

export const mapUserMoodTagFromDb = (row: SupabaseUserMoodTagRow): UserMoodTagDTO => ({
  userId: row.user_id,
  tagId: row.tag_id,
  pairId: row.pair_id,
  selectedAt: row.selected_at,
});
