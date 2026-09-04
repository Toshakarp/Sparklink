import { supabase } from '../client';
import { SUPABASE_TABLES } from '../constants/tables';
import {
  INITIAL_BUDGET_TIERS,
  INITIAL_PLACE_CATEGORIES,
  INITIAL_MOOD_TAGS,
  INITIAL_PLACES,
} from '../constants/initialPairData';

const generateUuid = (): string =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `id-${Math.random().toString(36).substring(2, 11)}`;


export const seedPairInitialData = async (pairId: string): Promise<void> => {
  try {
    const budgetMap = new Map<string, string>();
    const budgetRows = INITIAL_BUDGET_TIERS.map((tier) => {
      const id = generateUuid();
      budgetMap.set(tier.key, id);
      return {
        id,
        pair_id: pairId,
        label: tier.label,
        level: tier.level,
      };
    });

    const categoryMap = new Map<string, string>();
    const categoryRows = INITIAL_PLACE_CATEGORIES.map((cat) => {
      const id = generateUuid();
      categoryMap.set(cat.key, id);
      return {
        id,
        pair_id: pairId,
        label: cat.label,
        emoji: cat.emoji,
      };
    });

    const moodTagRows = INITIAL_MOOD_TAGS.map((tag) => ({
      id: generateUuid(),
      pair_id: pairId,
      label: tag.label,
      emoji: tag.emoji,
      audience: tag.audience,
    }));

    await Promise.all([
      supabase.from(SUPABASE_TABLES.BUDGET_TIERS).insert(budgetRows),
      supabase.from(SUPABASE_TABLES.PLACE_CATEGORIES).insert(categoryRows),
      supabase.from(SUPABASE_TABLES.MOOD_TAGS).insert(moodTagRows),
    ]);

    const placeRows = INITIAL_PLACES.map((place) => {
      const resolvedBudgetId = budgetMap.get(place.budgetTierKey) || null;
      const resolvedCategoryIds = place.categoryKeys
        .map((key) => categoryMap.get(key))
        .filter((id): id is string => Boolean(id));

      return {
        pair_id: pairId,
        title: place.title,
        emoji: place.emoji,
        description: place.description,
        address: place.address,
        budget_id: resolvedBudgetId,
        category_ids: resolvedCategoryIds,
        click_count: 0,
      };
    });

    await supabase.from(SUPABASE_TABLES.PLACES).insert(placeRows);
  } catch (error) {
    console.error('Failed to seed pair data', error);
  }
};
