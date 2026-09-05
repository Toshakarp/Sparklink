import type { IPlacesApi } from '../core/places.api';
import { supabase } from './client';
import { SUPABASE_TABLES } from './constants/tables';
import { mapPlaceFromDb } from './mappers/places.mapper';

export const createSupabasePlacesApi = (): IPlacesApi => ({
  getPlaces: async (pairId) => {
    const { data, error } = await supabase
      .from(SUPABASE_TABLES.PLACES)
      .select('*')
      .eq('pair_id', pairId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map(mapPlaceFromDb);
  },

  createPlace: async (pairId, placeData) => {
    const { data, error } = await supabase
      .from(SUPABASE_TABLES.PLACES)
      .insert({
        pair_id: pairId,
        title: placeData.title,
        emoji: placeData.emoji,
        address: placeData.address || null,
        description: placeData.description || null,
        category_ids: placeData.categoryIds || [],
        budget_id: placeData.budgetId || null,
        click_count: 0,
      })
      .select('*')
      .single();

    if (error) throw error;

    return mapPlaceFromDb(data);
  },

  updatePlace: async (place) => {
    const { error } = await supabase
      .from(SUPABASE_TABLES.PLACES)
      .update({
        title: place.title,
        emoji: place.emoji,
        address: place.address || null,
        description: place.description || null,
        category_ids: place.categoryIds || [],
        budget_id: place.budgetId || null,
        click_count: place.clickCount,
        last_clicked_at: place.lastClickedAt,
      })
      .eq('id', place.id);

    if (error) throw error;
  },

  deletePlace: async (placeId) => {
    const { error } = await supabase
      .from(SUPABASE_TABLES.PLACES)
      .delete()
      .eq('id', placeId);
    if (error) throw error;
  },
});
