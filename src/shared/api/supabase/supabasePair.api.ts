import type { IPairApi } from '../core/pair.api';
import { supabase } from './client';
import { SUPABASE_TABLES } from './constants/tables';
import {
  mapUserFromDb,
  mapCategoryFromDb,
  mapMoodTagFromDb,
  mapBudgetTierFromDb,
  mapUserMoodTagFromDb,
} from './mappers';
import { seedPairInitialData } from './services/seedPair';

export const createSupabasePairApi = (): IPairApi => ({
  getPartner: async (pairId, currentUserId) => {
    const { data, error } = await supabase
      .from(SUPABASE_TABLES.USERS)
      .select('*')
      .eq('pair_id', pairId)
      .neq('id', currentUserId)
      .single();

    if (error || !data) return null;

    return mapUserFromDb(data);
  },

  getPairData: async (pairId) => {
    const [categoriesRes, tagsRes, budgetRes] = await Promise.all([
      supabase.from(SUPABASE_TABLES.PLACE_CATEGORIES).select('*').eq('pair_id', pairId),
      supabase.from(SUPABASE_TABLES.MOOD_TAGS).select('*').eq('pair_id', pairId),
      supabase.from(SUPABASE_TABLES.BUDGET_TIERS).select('*').eq('pair_id', pairId),
   ]);

    return {
      placeCategories: (categoriesRes.data || []).map(mapCategoryFromDb),
      moodTags: (tagsRes.data || []).map(mapMoodTagFromDb),
      budgetTiers: (budgetRes.data || []).map(mapBudgetTierFromDb),
    };
  },

  createPairWithInvite: async (inviterParam, currentUserId) => {
    let inviterQuery = supabase.from(SUPABASE_TABLES.USERS).select('*');
    if (inviterParam.includes('-')) {
      inviterQuery = inviterQuery.eq('id', inviterParam);
    } else {
      inviterQuery = inviterQuery.eq('telegram_id', inviterParam);
    }

    const { data: inviter, error: inviterErr } = await inviterQuery.single();
    if (inviterErr || !inviter) {
      throw new Error('Пригласивший пользователь не найден');
    }

    if (inviter.id === currentUserId) {
      return { pairId: inviter.pair_id || '', partner: null };
    }

    let pairId = inviter.pair_id;
    if (pairId) {
      const { data: existingMembers, error: membersErr } = await supabase
        .from(SUPABASE_TABLES.USERS)
        .select('id')
        .eq('pair_id', pairId);

      if (!membersErr && existingMembers && existingMembers.length >= 2) {
        if (!existingMembers.some((m) => m.id === currentUserId)) {
          throw new Error('В этой паре уже есть 2 партнера!');
        }
      }
    } else {
      const { data: newPair, error: pairErr } = await supabase
        .from(SUPABASE_TABLES.PAIRS)
        .insert([{}])
        .select('*')
        .single();

      if (pairErr) {
        throw new Error('Не удалось создать пару');
      }

      pairId = newPair.id;
      await seedPairInitialData(pairId);
      await supabase
        .from(SUPABASE_TABLES.USERS)
        .update({ pair_id: pairId })
        .eq('id', inviter.id);
    }

    await supabase
      .from(SUPABASE_TABLES.USERS)
      .update({ pair_id: pairId })
      .eq('id', currentUserId);

    const partnerUser = mapUserFromDb(inviter);
    partnerUser.pairId = pairId;

    return {
      pairId,
      partner: partnerUser,
    };
  },

  getSelectedMoodTags: async (pairId) => {
    const { data, error } = await supabase
      .from(SUPABASE_TABLES.USER_MOOD_TAGS)
      .select('*')
      .eq('pair_id', pairId);

    if (error || !data) return [];

    return (data || []).map(mapUserMoodTagFromDb);
  },

  toggleUserMoodTag: async (userId, pairId, tagId, isSelected) => {
    if (isSelected) {
      const { error } = await supabase
        .from(SUPABASE_TABLES.USER_MOOD_TAGS)
        .insert({ user_id: userId, pair_id: pairId, tag_id: tagId });
      if (error) console.error('Failed to insert user_mood_tag', error);
    } else {
      const { error } = await supabase
        .from(SUPABASE_TABLES.USER_MOOD_TAGS)
        .delete()
        .match({ user_id: userId, tag_id: tagId });
      if (error) console.error('Failed to delete user_mood_tag', error);
    }
  },
});

