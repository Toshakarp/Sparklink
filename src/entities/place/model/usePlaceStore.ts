import { create } from 'zustand';
import { placeService } from "../api/placeService";
import type { PlaceDTO, TagDTO, BudgetTierDTO, CreatePlaceDTO } from '@/shared/api/mock/types';
import { tgService } from '@/shared/lib/telegram/telegram';

interface PlaceState {
  dateIdeas: PlaceDTO[];
  dateTags: TagDTO[];
  budgetTiers: BudgetTierDTO[];
  likedPlaceIds: string[];
  isLoading: boolean;
  fetchPlacesData: () => Promise<void>;
  addPlace: (place: CreatePlaceDTO) => void;
  updatePlace: (place: PlaceDTO) => void;
  deletePlace: (id: string) => void;
  incrementCount: (id: string) => void;
  addDateCategory: (tag: Omit<TagDTO, 'id'>) => void;
  updateDateCategory: (tag: TagDTO) => void;
  deleteDateCategory: (id: string) => void;
  updateBudgetTier: (tier: BudgetTierDTO) => void;
}

export const usePlaceStore = create<PlaceState>((set) => ({
  dateIdeas: [],
  dateTags: [],
  budgetTiers: [],
  likedPlaceIds: [],
  isLoading: false,

  fetchPlacesData: async () => {
    set({ isLoading: true });
    try {
      const [places, tags, budgets] = await Promise.all([
        placeService.getPlaces(),
        placeService.getDateTags(),
        placeService.getBudgetTiers()
      ]);
      set({ dateIdeas: places, dateTags: tags, budgetTiers: budgets, isLoading: false });
    } catch (e) {
      set({ isLoading: false });
    }
  },

  addPlace: (newPlace) => {
    const place: PlaceDTO = {
      id: `place-${Date.now()}`,
      title: newPlace.title,
      description: newPlace.description || '',
      address: newPlace.address || '',
      emoji: newPlace.emoji || '🍿',
      tagIds: newPlace.tagIds || [],
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
    const newCategory: TagDTO = { ...tag, id: `date-tag-${Date.now()}`, type: 'date' };
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
