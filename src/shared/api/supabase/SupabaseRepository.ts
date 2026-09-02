import { supabase } from './client';
import type { IRepository, PairData } from '../core/IRepository';


export const createSupabaseRepository = (): IRepository => {
  return {
    getUserByTelegramId: async (telegramId) => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('telegram_id', telegramId.toString())
        .single();
      
      if (error) throw error;
      if (!data) return null;

      return {
        id: data.id,
        telegramId: data.telegram_id,
        firstName: data.first_name,
        photoUrl: data.avatar_url,
        themeColor: data.theme_color,
        moodId: data.mood_id,
        energyLevel: data.energy_level,
        pairId: data.pair_id,
        lockitPhotoUrl: data.lockit_photo_url,
      };
    },

    getPartner: async (pairId, currentUserId) => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('pair_id', pairId)
        .neq('id', currentUserId)
        .single();

      if (error) throw error;
      if (!data) return null;

      return {
        id: data.id,
        telegramId: data.telegram_id,
        firstName: data.first_name,
        photoUrl: data.avatar_url,
        themeColor: data.theme_color,
        moodId: data.mood_id,
        energyLevel: data.energy_level,
        pairId: data.pair_id,
        lockitPhotoUrl: data.lockit_photo_url,
      };
    },

    getPairData: async (pairId): Promise<PairData> => {
      // Параллельно загружаем все связанные таблицы для минимизации задержки
      const [placesRes, categoriesRes, tagsRes, budgetRes] = await Promise.all([
        supabase.from('places').select('*').eq('pair_id', pairId).order('created_at', { ascending: false }),
        supabase.from('place_categories').select('*').eq('pair_id', pairId),
        supabase.from('mood_tags').select('*').eq('pair_id', pairId),
        supabase.from('budget_tiers').select('*').eq('pair_id', pairId)
      ]);

      return {
        places: (placesRes.data || []).map(p => ({
           id: p.id,
           title: p.title,
           emoji: p.emoji,
           address: p.address || undefined,
           description: p.description || undefined,
           categoryIds: p.category_ids || [],
           tagIds: p.category_ids || [],
           budgetId: p.budget_id,
           clickCount: p.click_count || 0,
           lastClickedAt: p.last_clicked_at,
           createdAt: p.created_at,
        })),
        placeCategories: categoriesRes.data || [],
        moodTags: tagsRes.data || [],
        budgetTiers: budgetRes.data || [],
      };
    },

    createPlace: async (pairId, placeData) => {
      const { data, error } = await supabase
        .from('places')
        .insert({
          pair_id: pairId,
          title: placeData.title,
          emoji: placeData.emoji,
          address: placeData.address || null,
          description: placeData.description || null,
          category_ids: placeData.categoryIds || [],
          budget_id: placeData.budgetId || null,
          click_count: 0
        })
        .select('*')
        .single();

      if (error) throw error;

      return {
        id: data.id,
        title: data.title,
        emoji: data.emoji,
        address: data.address || undefined,
        description: data.description || undefined,
        categoryIds: data.category_ids || [],
        tagIds: data.category_ids || [],
        budgetId: data.budget_id,
        clickCount: data.click_count || 0,
        lastClickedAt: data.last_clicked_at,
        createdAt: data.created_at,
      };
    },

    updatePlace: async (place) => {
      const { error } = await supabase
        .from('places')
        .update({
          title: place.title,
          emoji: place.emoji,
          address: place.address || null,
          description: place.description || null,
          category_ids: place.categoryIds || place.tagIds || [],
          budget_id: place.budgetId || null,
          click_count: place.clickCount,
          last_clicked_at: place.lastClickedAt
        })
        .eq('id', place.id);

      if (error) throw error;
    },


    deletePlace: async (placeId) => {
      const { error } = await supabase
        .from('places')
        .delete()
        .eq('id', placeId);

      if (error) throw error;
    },

    updateUserMood: async (userId, energy, moodId) => {
      const { error } = await supabase
        .from('users')
        .update({ 
          energy_level: energy, 
          mood_id: moodId 
        })
        .eq('id', userId);
        
      if (error) throw error;
    },

    upsertUser: async (userData) => {
      const { data, error } = await supabase
        .from('users')
        .upsert(
          {
            telegram_id: userData.telegramId.toString(),
            first_name: userData.firstName,
            avatar_url: userData.photoUrl,
            theme_color: userData.themeColor || '#FF4B4B',
          },
          { onConflict: 'telegram_id' }
        )
        .select('*')
        .single();

      if (error) throw error;

      return {
        id: data.id,
        telegramId: data.telegram_id,
        firstName: data.first_name,
        photoUrl: data.avatar_url,
        themeColor: data.theme_color,
        moodId: data.mood_id,
        energyLevel: data.energy_level,
        pairId: data.pair_id,
        lockitPhotoUrl: data.lockit_photo_url,
      };
    },

    // - inviterParam: UUID пользователя из нашей БД (или telegram_id как fallback)
    // - currentUserId: UUID текущего пользователя, перешедшего по ссылке
    createPairWithInvite: async (inviterParam, currentUserId) => {
      // Ищем пригласившего пользователя 
      let inviterQuery = supabase.from('users').select('*');
      if (inviterParam.includes('-')) {
        inviterQuery = inviterQuery.eq('id', inviterParam); // UUID из нашей БД
      } else {
        inviterQuery = inviterQuery.eq('telegram_id', inviterParam); // Fallback по telegram_id
      }
      
      const { data: inviter, error: inviterErr } = await inviterQuery.single();
      if (inviterErr || !inviter) {
        throw new Error('Пригласивший пользователь не найден');
      }

      // Нельзя привязать самого себя
      if (inviter.id === currentUserId) {
        return { pairId: inviter.pair_id || '', partner: null };
      }

      let pairId = inviter.pair_id;

      //Если у пригласившего уже есть пара, проверяем количество участников
      if (pairId) {
        const { data: existingMembers, error: membersErr } = await supabase
          .from('users')
          .select('id')
          .eq('pair_id', pairId);

        if (!membersErr && existingMembers && existingMembers.length >= 2) {
          const isAlreadyMember = existingMembers.some((m) => m.id === currentUserId);
          if (!isAlreadyMember) {
            throw new Error('В этой паре уже есть 2 партнера! Ссылка недействительна.');
          }
        }
      } else {
        // Если у пригласившего еще нет пары, создаем новую запись в таблице pairs
        const { data: newPair, error: pairErr } = await supabase
          .from('pairs')
          .insert({})
          .select('*')
          .single();

        if (pairErr) throw new Error('Не удалось создать пару: ' + pairErr.message);
        pairId = newPair.id;

        // Привязываем пару к пригласившему
        const { error: updateInviterErr } = await supabase
          .from('users')
          .update({ pair_id: pairId })
          .eq('id', inviter.id);
        if (updateInviterErr) throw updateInviterErr;
      }

      //Привязываем пару к текущему пользователю
      const { error: updateCurrErr } = await supabase
        .from('users')
        .update({ pair_id: pairId })
        .eq('id', currentUserId);

      if (updateCurrErr) throw updateCurrErr;

      const partnerDTO = {
        id: inviter.id,
        telegramId: inviter.telegram_id,
        firstName: inviter.first_name,
        photoUrl: inviter.avatar_url,
        themeColor: inviter.theme_color,
        moodId: inviter.mood_id,
        energyLevel: inviter.energy_level,
        pairId: pairId,
        lockitPhotoUrl: inviter.lockit_photo_url,
      };

      return { pairId, partner: partnerDTO };
    },

    updateLockitPhoto: async (userId, photoUrl) => {
      const { error } = await supabase
        .from('users')
        .update({ 
          lockit_photo_url: photoUrl, 
          lockit_updated_at: new Date().toISOString() 
        })
        .eq('id', userId);
        
      if (error) throw error;
    }
  };
};


