import { create } from 'zustand';
import type { TagDTO } from '@/shared/api/mock/types';
import { tgService } from '@/shared/lib/telegram/telegram';
import { useInitStore } from '@/app/model/useInitStore';

interface WishTagsState {
  moodTags: TagDTO[];
  isLoading: boolean;
  fetchTags: (pairId?: string) => Promise<void>;
  toggleMoodTag: (tagId: string) => void;
  addMoodTag: (tag: Omit<TagDTO, 'id'>) => void;
  updateMoodTag: (tag: TagDTO) => void;
  deleteMoodTag: (id: string) => void;
}

export const useWishTagsStore = create<WishTagsState>((set) => ({
  moodTags: [],
  isLoading: false,
  
  fetchTags: async (pairId?: string) => {
    set({ isLoading: true });
    try {
      const api = useInitStore.getState().api;
      if (!api || !pairId) {
         set({ isLoading: false });
         return;
      }
      
      const data = await api.getPairData(pairId);
      set({ moodTags: data.moodTags, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },
  
  toggleMoodTag: (tagId) => {
    set((state) => ({
      moodTags: state.moodTags.map((tag) => {
        if (tag.id === tagId) {
          const isSelected = !tag.selectedByMe;
          const markedBy = tag.markedBy || [];
          const updatedMarkedBy = isSelected
            ? [...markedBy.filter((id) => id !== 'user'), 'user']
            : markedBy.filter((id) => id !== 'user');
          return { ...tag, selectedByMe: isSelected, markedBy: updatedMarkedBy };
        }
        return tag;
      })
    }));
    tgService.haptic('light');
  },
  
  addMoodTag: (tag) => {
    const newTag: TagDTO = { 
      ...tag, 
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `tag-${Date.now()}`, 
      type: 'mood', 
      markedBy: [], 
      selectedByMe: false, 
      selectedByPartner: false 
    };
    set((state) => ({ moodTags: [...state.moodTags, newTag] }));
    tgService.haptic('success');
  },
  
  updateMoodTag: (updatedTag) => {
    set((state) => ({
      moodTags: state.moodTags.map((t) => (t.id === updatedTag.id ? updatedTag : t)),
    }));
    tgService.haptic('light');
  },
  
  deleteMoodTag: (id) => {
    set((state) => ({ moodTags: state.moodTags.filter((t) => t.id !== id) }));
    tgService.haptic('medium');
  }
}));
