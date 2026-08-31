import { mockPlacesDTO } from '@/shared/api/mock/places.mock';
import { mockDateTagsDTO, mockBudgetTiersDTO } from '@/shared/api/mock/tags.mock';
import type { PlaceDTO, TagDTO, BudgetTierDTO, CreatePlaceDTO } from '@/shared/api/mock/types';

export const placeService = {
  /**
   * Fetches pair's date ideas and favorite places.
   */
  async getPlaces(): Promise<PlaceDTO[]> {
    // TODO: [Supabase Realtime Integration]
    // Fetch places associated with the pair:
    // const { data } = await supabase.from('date_places').select('*').eq('pair_id', currentPairId).order('created_at', { ascending: false });
    return Promise.resolve(mockPlacesDTO);
  },

  /**
   * Fetches date category tags (Active, Romantic, Food, etc.).
   */
  async getDateTags(): Promise<TagDTO[]> {
    // TODO: [Supabase Integration]
    // Fetch categories:
    // const { data } = await supabase.from('date_tags').select('*').or(`pair_id.eq.${currentPairId},is_system.eq.true`);
    return Promise.resolve(mockDateTagsDTO);
  },

  /**
   * Fetches configured budget tiers.
   */
  async getBudgetTiers(): Promise<BudgetTierDTO[]> {
    // TODO: [Supabase Integration]
    // Fetch budget presets from DB:
    // const { data } = await supabase.from('budget_tiers').select('*').order('tier_order');
    return Promise.resolve(mockBudgetTiersDTO);
  },

  /**
   * Creates or updates a date idea.
   */
  async savePlace(place: CreatePlaceDTO): Promise<PlaceDTO> {
    // TODO: [Supabase Realtime Integration]
    // const { data } = await supabase.from('date_places').insert({ ...place, pair_id: currentPairId }).select().single();
    // return data;
    const newPlace: PlaceDTO = {
      id: `place-${Date.now()}`,
      description: '',
      ...place,
      clickCount: 0,
      lastClickedAt: null,
    };
    return Promise.resolve(newPlace);
  }
};

