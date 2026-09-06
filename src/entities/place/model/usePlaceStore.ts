import { create } from 'zustand';
import type { PlaceDTO, BudgetTierDTO, CreatePlaceDTO, DateCategoryDTO } from '@/shared/api/types/models';

import { tgService } from '@/shared/lib/telegram/telegram';

export interface PlaceState {
  dateIdeas: PlaceDTO[];
  dateTags: DateCategoryDTO[];
  budgetTiers: BudgetTierDTO[];
  likedPlaceIds: string[];
  isLoading: boolean;
  
  setPlacesData: (places: PlaceDTO[], tags: DateCategoryDTO[], tiers: BudgetTierDTO[]) => void;
  addPlace: (place: CreatePlaceDTO | PlaceDTO) => void;
  updatePlace: (place: PlaceDTO) => void;
  deletePlace: (id: string) => void;
  incrementCount: (id: string) => void;
  rollbackIncrementCount: (id: string, originalClickCount?: number, originalLastClickedAt?: string | null) => void;
  replacePlace: (oldId: string, newPlace: PlaceDTO) => void;
  
  addDateCategory: (tag: (Omit<DateCategoryDTO, 'id' | 'pairId'> & { id?: string; pairId?: string })) => void;
  updateDateCategory: (tag: DateCategoryDTO) => void;
  deleteDateCategory: (id: string) => void;
  replaceDateCategory: (oldId: string, newCategory: DateCategoryDTO) => void;
  
  updateBudgetTier: (tier: BudgetTierDTO) => void;
  setBudgetTiers: (tiers: BudgetTierDTO[]) => void;
}

export const usePlaceStore = create<PlaceState>((set) => ({
  dateIdeas: [],
  dateTags: [],
  budgetTiers: [],
  likedPlaceIds: [],
  isLoading: false,

  setPlacesData: (places, tags, tiers) => set({ dateIdeas: places, dateTags: tags, budgetTiers: tiers, isLoading: false }),

  addPlace: (newPlace) => {
    const p = newPlace as Partial<PlaceDTO>;
    const place: PlaceDTO = {
      id: p.id || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'temp-id'),
      title: newPlace.title,
      emoji: newPlace.emoji || '🍿',
      address: newPlace.address,
      description: newPlace.description,
      categoryIds: newPlace.categoryIds || [],
      budgetId: newPlace.budgetId || 'budget',
      clickCount: p.clickCount || 0,
      lastClickedAt: p.lastClickedAt || null,
      createdAt: p.createdAt || new Date().toISOString(),
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

  rollbackIncrementCount: (id, originalClickCount, originalLastClickedAt) => {
    set((state) => ({
      likedPlaceIds: state.likedPlaceIds.filter((pId) => pId !== id),
      dateIdeas: state.dateIdeas.map((p) =>
        p.id === id
          ? {
              ...p,
              clickCount: originalClickCount !== undefined ? originalClickCount : Math.max(0, (p.clickCount || 1) - 1),
              lastClickedAt: originalLastClickedAt !== undefined ? originalLastClickedAt : null,
            }
          : p
      ),
    }));
  },

  replacePlace: (oldId, newPlace) => {
    set((state) => ({
      dateIdeas: state.dateIdeas.map((p) => (p.id === oldId ? newPlace : p)),
    }));
  },
  
  addDateCategory: (tag) => {
    const t = tag as Partial<DateCategoryDTO>;
    const newCategory: DateCategoryDTO = { 
       ...tag, 
       id: t.id || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'cat-temp'),
      pairId: t.pairId || 'local'
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

  replaceDateCategory: (oldId, newCategory) => {
    set((state) => ({
      dateTags: state.dateTags.map((t) => (t.id === oldId ? newCategory : t)),
    }));
  },

  updateBudgetTier: (updatedTier) => {
    set((state) => ({ budgetTiers: state.budgetTiers.map((t) => (t.id === updatedTier.id ? updatedTier : t)) }));
    tgService.haptic('success');
  },

  setBudgetTiers: (tiers) => {
    set({ budgetTiers: tiers });
  }
}));
