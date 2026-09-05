import type { IUserApi } from '../core/user.api';
import { supabase } from './client';
import { SUPABASE_TABLES } from './constants/tables';
import { mapUserFromDb } from './mappers/user.mapper';

export const createSupabaseUserApi = (): IUserApi => ({
  getUserByTelegramId: async (telegramId) => {
    const { data, error } = await supabase
      .from(SUPABASE_TABLES.USERS)
      .select('*')
      .eq('telegram_id', telegramId.toString())
      .single();

    if (error || !data) return null;

    return mapUserFromDb(data);
  },

  upsertUser: async (userData) => {
    const { data: existingUser } = await supabase
      .from(SUPABASE_TABLES.USERS)
      .select('*')
      .eq('telegram_id', userData.telegramId.toString())
      .maybeSingle();

    if (existingUser) {
      const updatePayload: Record<string, unknown> = {
        first_name: userData.firstName,
      };
      if (userData.photoUrl) {
        updatePayload.avatar_url = userData.photoUrl;
      }
      if (userData.themeColor) {
        updatePayload.theme_color = userData.themeColor;
      }

      const { data, error } = await supabase
        .from(SUPABASE_TABLES.USERS)
        .update(updatePayload)
        .eq('id', existingUser.id)
        .select('*')
        .single();

      if (error) throw error;
      return mapUserFromDb(data);
    }

    const { data, error } = await supabase
      .from(SUPABASE_TABLES.USERS)
      .insert({
        telegram_id: userData.telegramId.toString(),
        first_name: userData.firstName,
        avatar_url: userData.photoUrl || null,
        theme_color: userData.themeColor || '#FF4B4B',
      })
      .select('*')
      .single();

    if (error) throw error;

    return mapUserFromDb(data);
  },

  updateUserMood: async (userId, energy, moodId) => {
    const { error } = await supabase
      .from(SUPABASE_TABLES.USERS)
      .update({ energy_level: energy, mood_id: moodId })
      .eq('id', userId);

    if (error) throw error;
  },

  updateLockitPhoto: async (userId, photoUrl) => {
    const { error } = await supabase
      .from(SUPABASE_TABLES.USERS)
      .update({
        lockit_photo_url: photoUrl,
        lockit_updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (error) throw error;
  },

  updateThemeColor: async (userId, color) => {
    const { error } = await supabase
      .from(SUPABASE_TABLES.USERS)
      .update({ theme_color: color })
      .eq('id', userId);

    if (error) throw error;
  },
});
