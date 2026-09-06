import type { IPairApi } from '../core/pair.api';
import { supabase } from './client';
import { SUPABASE_TABLES } from './constants/tables';
import {
  mapCategoryFromDb,
  mapMoodTagFromDb,
  mapBudgetTierFromDb,
} from './mappers';
import { seedPairInitialData } from './services/seedPair';
import { getPartner, createPairWithInvite } from './modules/pair.module';
import {
  getSelectedMoodTags,
  createMoodTag,
  updateMoodTag,
  deleteMoodTag,
  toggleUserMoodTag,
} from './modules/moodTags.module';

export const createSupabasePairApi = (): IPairApi => ({
  getPartner,
  createPairWithInvite,
  getSelectedMoodTags,
  createMoodTag,
  updateMoodTag,
  deleteMoodTag,
  toggleUserMoodTag,
  getPairData: async (pairId) => {
    const [categoriesRes, tagsRes, budgetRes] = await Promise.all([
      supabase.from(SUPABASE_TABLES.PLACE_CATEGORIES).select('*').eq('pair_id', pairId),
      supabase.from(SUPABASE_TABLES.MOOD_TAGS).select('*').eq('pair_id', pairId),
      supabase.from(SUPABASE_TABLES.BUDGET_TIERS).select('*').eq('pair_id', pairId),
    ]);

    let placeCategories = (categoriesRes.data || []).map(mapCategoryFromDb);
    let moodTags = (tagsRes.data || []).map(mapMoodTagFromDb);
    let budgetTiers = (budgetRes.data || []).map(mapBudgetTierFromDb);

    if (placeCategories.length === 0 || moodTags.length === 0 || budgetTiers.length === 0) {
      try {
        await seedPairInitialData(pairId);
        const [refreshedCats, refreshedTags, refreshedBudgets] = await Promise.all([
          supabase.from(SUPABASE_TABLES.PLACE_CATEGORIES).select('*').eq('pair_id', pairId),
          supabase.from(SUPABASE_TABLES.MOOD_TAGS).select('*').eq('pair_id', pairId),
          supabase.from(SUPABASE_TABLES.BUDGET_TIERS).select('*').eq('pair_id', pairId),
        ]);

        placeCategories = (refreshedCats.data || []).map(mapCategoryFromDb);
        moodTags = (refreshedTags.data || []).map(mapMoodTagFromDb);
        budgetTiers = (refreshedBudgets.data || []).map(mapBudgetTierFromDb);
      } catch (err) {
        console.error('Failed to run fallback seed for pair', err);
      }
    }

    return {
      placeCategories,
      moodTags,
      budgetTiers,
    };
  },
  updateBudgetTier: async (tier) => {
    const { error } = await supabase
      .from(SUPABASE_TABLES.BUDGET_TIERS)
      .update({
        label: tier.label,
        range_label: tier.rangeLabel,
        emoji: tier.emoji,
        level: tier.level,
      })
      .eq('id', tier.id);
    if (error) throw error;
  },
});
