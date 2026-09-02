import { create } from 'zustand';
import type { PlaceDTO, BudgetTierDTO, CreatePlaceDTO } from '@/shared/api/mock/types';
import type { DateCategoryDTO } from '@/shared/api/core/IRepository';
import { tgService } from '@/shared/lib/telegram/telegram';
import { useInitStore } from '@/app/model/useInitStore';


export interface PlaceState {
  dateIdeas: PlaceDTO[];
  dateTags: DateCategoryDTO[];
  budgetTiers: BudgetTierDTO[];
  likedPlaceIds: string[];
  isLoading: boolean;
  
  fetchPlacesData: (pairId?: string) => Promise<void>;
  addPlace: (place: CreatePlaceDTO) => void;
  updatePlace: (place: PlaceDTO) => void;
  deletePlace: (id: string) => void;
  incrementCount: (id: string) => void;
  
  addDateCategory: (tag: Omit<DateCategoryDTO, 'id' | 'pair_id'>) => void;
  updateDateCategory: (tag: DateCategoryDTO) => void;
  deleteDateCategory: (id: string) => void;
  
  updateBudgetTier: (tier: BudgetTierDTO) => void;
}

export const usePlaceStore = create<PlaceState>((set) => ({
  dateIdeas: [],
  dateTags: [],
  budgetTiers: [],
  likedPlaceIds: [],
  isLoading: false,

  fetchPlacesData: async (pairId?: string) => {
    set({ isLoading: true });
    try {
      const api = useInitStore.getState().api;
      if (!api || !pairId) {
        set({ isLoading: false });
        return;
      }
      
      const data = await api.getPairData(pairId);
      set({ 
        dateIdeas: data.places, 
        dateTags: data.placeCategories, 
        budgetTiers: data.budgetTiers, 
        isLoading: false 
      });
    } catch {
      set({ isLoading: false });
    }
  },
  
  addPlace: (newPlace) => {
    const place: PlaceDTO = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `place-${Date.now()}`,
      title: newPlace.title,
      emoji: newPlace.emoji || '🍿',
      address: newPlace.address,
      description: newPlace.description,
      categoryIds: newPlace.categoryIds || [],
      tagIds: newPlace.categoryIds || [],
      budgetId: newPlace.budgetId || 'budget',
      clickCount: 0,
      lastClickedAt: null,
      createdAt: new Date().toISOString(),
    };
    set((state) => ({ dateIdeas: [place, ...state.dateIdeas] }));
    tgService.haptic('success');
  },
  
  updatePlace: (updatedPlace) => {
    set((state) => ({
      dateIdeas: state.dateIdeas.map((p) => (p.id === updatedPlace.id ? updatedPlace : p))
    }));
    tgService.haptic('success');
  },
  
  deletePlace: (id) => {
    set((state) => ({ dateIdeas: state.dateIdeas.filter((p) => p.id !== id) }));
    tgService.haptic('medium');
  },

  incrementCount: (id) => {
    set((state) => {
      const alreadyLiked = state.likedPlaceIds.includes(id);
      if (alreadyLiked) return state;
      return {
        likedPlaceIds: [...state.likedPlaceIds, id],
        dateIdeas: state.dateIdeas.map((p) =>
          p.id === id ? { ...p, clickCount: (p.clickCount || 0) + 1, lastClickedAt: 'Только что' } : p
        ),
      };
    });
    tgService.haptic('medium');
  },
  
  addDateCategory: (tag) => {
    const newCategory: DateCategoryDTO = { 
      ...tag, 
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `cat-${Date.now()}`,
      pair_id: 'local'
    };
    set((state) => ({ dateTags: [...state.dateTags, newCategory] }));
    tgService.haptic('success');
  },
  
  updateDateCategory: (tag) => {
    set((state) => ({ dateTags: state.dateTags.map((t) => (t.id === tag.id ? tag : t)) }));
    tgService.haptic('success');
  },
  
  deleteDateCategory: (id) => {
    set((state) => ({ dateTags: state.dateTags.filter((t) => t.id !== id) }));
    tgService.haptic('medium');
  },

  updateBudgetTier: (updatedTier) => {
    set((state) => ({ budgetTiers: state.budgetTiers.map((t) => (t.id === updatedTier.id ? updatedTier : t)) }));
    tgService.haptic('success');
  }
}));

