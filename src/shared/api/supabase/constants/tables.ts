export const SUPABASE_TABLES = {
  USERS: 'users',
  PLACES: 'places',
  PAIRS: 'pairs',
  PLACE_CATEGORIES: 'place_categories',
  MOOD_TAGS: 'mood_tags',
  BUDGET_TIERS: 'budget_tiers',
  USER_MOOD_TAGS: 'user_mood_tags',
} as const;

export type SupabaseTable = typeof SUPABASE_TABLES[keyof typeof SUPABASE_TABLES];
