import { supabase } from './client';
import type { IRepository, PairData } from '../core/IRepository';

// ============================================================================
// Реализация репозитория для работы с реальной базой данных Supabase
// ============================================================================
// Этот модуль отвечает за:
// 1. Прямые обращения к таблицам PostgreSQL через Supabase Client.
// 2. Трансформацию snake_case полей базы данных в camelCase DTO-модели приложения.
// 3. Изоляцию сетевых запросов от UI и Zustand-сторов.
export const createSupabaseRepository = (): IRepository => {
  return {
    // ------------------------------------------------------------------------
    // Поиск пользователя по Telegram ID
    // ------------------------------------------------------------------------
    getUserByTelegramId: async (telegramId) => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('telegram_id', telegramId.toString())
        .single();
      
      // PGRST116 означает "строка не найдена" (юзер впервые зашел) — это не критическая ошибка
      if (error && error.code !== 'PGRST116') throw error;
      if (!data) return null;

      // Маппинг из snake_case структуры таблицы users в camelCase интерфейс UserDTO
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

    // ------------------------------------------------------------------------
    // Получение данных партнера по ID пары
    // ------------------------------------------------------------------------
    getPartner: async (pairId, currentUserId) => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('pair_id', pairId)
        .neq('id', currentUserId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
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

    // Загрузка всех данных, привязанных к паре 
    getPairData: async (pairId): Promise<PairData> => {

      const [placesRes, categoriesRes, tagsRes, budgetRes] = await Promise.all([
        supabase.from('places').select('*').eq('pair_id', pairId),
        supabase.from('place_categories').select('*').eq('pair_id', pairId),
        supabase.from('mood_tags').select('*').eq('pair_id', pairId),
        supabase.from('budget_tiers').select('*').eq('pair_id', pairId)
      ]);

      return {
        places: (placesRes.data || []).map(p => ({
           id: p.id,
           title: p.title,
           emoji: p.emoji,
           categoryIds: p.category_ids,
           budgetId: p.budget_id,
           clickCount: p.click_count || 0,
           lastClickedAt: p.last_clicked_at,
        })),
        placeCategories: categoriesRes.data || [],
        moodTags: tagsRes.data || [],
        budgetTiers: budgetRes.data || [],
      };
    },


    // Сохранение текущего настроения и уровня энергии
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

    // обновление пользовател
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

    // Deep link invite flow)
    // Принимает:
    // inviterParam: UUID пользователя (или telegram_id fallback, надо будет убрать!!!!!!)
    // currentUserId: UUID пользователя, перешедшего по ссылке
    createPairWithInvite: async (inviterParam, currentUserId) => {
        
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

      // проверяем количество участников
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
        // Если  нет пары, создаем новую запись в таблице pairs
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

      // 3. Привязываем пару к текущему пользователю
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

    // Обновление фото виджета LockIt
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



