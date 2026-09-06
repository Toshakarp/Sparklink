import { supabase } from '../client';
import { SUPABASE_TABLES } from '../constants/tables';
import {
  INITIAL_BUDGET_TIERS,
  INITIAL_PLACE_CATEGORIES,
  INITIAL_MOOD_TAGS,
  INITIAL_PLACES,
} from '../constants/initialPairData';

export const seedPairInitialData = async (pairId: string): Promise<void> => {
  try {
    const budgetRows = INITIAL_BUDGET_TIERS.map((tier) => ({
      pair_id: pairId,
      name: tier.label,
      color_level: tier.level,
      emoji: tier.emoji,
    }));

    const categoryRows = INITIAL_PLACE_CATEGORIES.map((cat) => ({
      pair_id: pairId,
      label: cat.label,
      emoji: cat.emoji,
    }));

    const moodTagRows = INITIAL_MOOD_TAGS.map((tag) => ({
      pair_id: pairId,
      label: tag.label,
      emoji: tag.emoji,
      audience: tag.audience,
    }));

    // Сохраняем в БД, получая сгенерированные базой ID
    const [budgetRes, categoryRes, moodTagRes] = await Promise.all([
      supabase.from(SUPABASE_TABLES.BUDGET_TIERS).insert(budgetRows).select('id, color_level'),
      supabase.from(SUPABASE_TABLES.PLACE_CATEGORIES).insert(categoryRows).select('id, label'),
      supabase.from(SUPABASE_TABLES.MOOD_TAGS).insert(moodTagRows),
    ]);

    if (budgetRes.error) {
      console.error('Failed to insert budget tiers:', budgetRes.error);
    }
    if (categoryRes.error) {
      console.error('Failed to insert place categories:', categoryRes.error);
    }
    if (moodTagRes.error) {
      console.error('Failed to insert mood tags:', moodTagRes.error);
    }

    const createdBudgets = budgetRes.data || [];
    const createdCategories = categoryRes.data || [];

    const budgetMap = new Map<string, string>();
    INITIAL_BUDGET_TIERS.forEach((tier) => {
      const match = createdBudgets.find((b) => b.color_level === tier.level);
      if (match) budgetMap.set(tier.key, match.id);
    });

    const categoryMap = new Map<string, string>();
    INITIAL_PLACE_CATEGORIES.forEach((cat) => {
      const match = createdCategories.find((c) => c.label === cat.label);
      if (match) categoryMap.set(cat.key, match.id);
    });

    // Создаем стартовые места, резолвя budget_id и category_ids по ID из базы
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

    const placesRes = await supabase.from(SUPABASE_TABLES.PLACES).insert(placeRows);
    if (placesRes.error) {
      console.error('Failed to insert places:', placesRes.error);
    }
  } catch (error) {
    console.error('Failed to seed pair data', error);
  }
};
