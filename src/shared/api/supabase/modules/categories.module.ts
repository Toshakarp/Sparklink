import { supabase } from '../client';
import { SUPABASE_TABLES } from '../constants/tables';
import { mapCategoryFromDb } from '../mappers';
import type { DateCategoryDTO } from '../../types/models';

export const createDateCategory = async (pairId: string, label: string, emoji: string): Promise<DateCategoryDTO> => {
  const { data, error } = await supabase
    .from(SUPABASE_TABLES.PLACE_CATEGORIES)
    .insert({ pair_id: pairId, label, emoji })
    .select('*')
    .single();
  if (error) throw error;
  return mapCategoryFromDb(data);
};

export const updateDateCategory = async (category: DateCategoryDTO): Promise<void> => {
  const { error } = await supabase
    .from(SUPABASE_TABLES.PLACE_CATEGORIES)
    .update({ label: category.label, emoji: category.emoji })
    .eq('id', category.id);
  if (error) throw error;
};

export const deleteDateCategory = async (categoryId: string): Promise<void> => {
  const { error } = await supabase
    .from(SUPABASE_TABLES.PLACE_CATEGORIES)
    .delete()
    .eq('id', categoryId);
  if (error) throw error;
};
