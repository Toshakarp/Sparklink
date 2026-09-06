import { supabase } from '../client';
import { SUPABASE_TABLES } from '../constants/tables';
import { mapMoodTagFromDb, mapUserMoodTagFromDb } from '../mappers';
import type { TagDTO, UserMoodTagDTO } from '../../types/models';

export const getSelectedMoodTags = async (pairId: string): Promise<UserMoodTagDTO[]> => {
  const { data, error } = await supabase
    .from(SUPABASE_TABLES.USER_MOOD_TAGS)
    .select('*')
    .eq('pair_id', pairId);

  if (error || !data) return [];
  return data.map(mapUserMoodTagFromDb);
};

export const createMoodTag = async (pairId: string, label: string, emoji: string, audience: 'together' | 'alone'): Promise<TagDTO> => {
  const { data, error } = await supabase
    .from(SUPABASE_TABLES.MOOD_TAGS)
    .insert({ pair_id: pairId, label, emoji, audience })
    .select('*')
    .single();
  
  if (error) throw error;
  return mapMoodTagFromDb(data);
};

export const updateMoodTag = async (tag: TagDTO): Promise<void> => {
  const { error } = await supabase
    .from(SUPABASE_TABLES.MOOD_TAGS)
    .update({ label: tag.label, emoji: tag.emoji, audience: tag.audience })
    .eq('id', tag.id);
  
  if (error) throw error;
};

export const deleteMoodTag = async (tagId: string): Promise<void> => {
  const { error } = await supabase
    .from(SUPABASE_TABLES.MOOD_TAGS)
    .delete()
    .eq('id', tagId);
    
  if (error) throw error;
};

export const toggleUserMoodTag = async (userId: string, pairId: string, tagId: string, isSelected: boolean): Promise<void> => {
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
};
