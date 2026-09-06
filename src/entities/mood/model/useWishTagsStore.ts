import { create } from 'zustand';
import type { TagDTO } from '@/shared/api/types/models';

import { tgService } from '@/shared/lib/telegram/telegram';

export interface WishTagsState {
  moodTags: TagDTO[];
  mySelectedTagIds: string[];
  partnerSelectedTagIds: string[];
  isLoading: boolean;
  
  setTags: (tags: TagDTO[]) => void;
  setSelectedTags: (myTagIds: string[], partnerTagIds: string[]) => void;
  setPartnerSelectedTags: (partnerTagIds: string[]) => void;
  toggleMoodTag: (id: string) => void;
  markPartnerTag: (id: string) => void;
  
  addMoodTag: (tag: Omit<TagDTO, 'id'> & { id?: string }) => void;
  updateMoodTag: (tag: TagDTO) => void;
  deleteMoodTag: (id: string) => void;
  replaceMoodTag: (oldId: string, newTag: TagDTO) => void;
}

export const useWishTagsStore = create<WishTagsState>((set) => ({
  moodTags: [],
  mySelectedTagIds: [],
  partnerSelectedTagIds: [],
  isLoading: false,

  setTags: (tags) => set({ moodTags: tags }),
  setSelectedTags: (myTagIds, partnerTagIds) => set({
    mySelectedTagIds: myTagIds,
    partnerSelectedTagIds: partnerTagIds,
  }),
  setPartnerSelectedTags: (partnerTagIds) => set({ partnerSelectedTagIds: partnerTagIds }),

  toggleMoodTag: (id: string) => {
    set((state) => {
      const isSelected = state.mySelectedTagIds.includes(id);
      return {
        mySelectedTagIds: isSelected
          ? state.mySelectedTagIds.filter(t => t !== id)
          : [...state.mySelectedTagIds, id]
      };
    });
    tgService.haptic('light');
  },

  markPartnerTag: (id: string) => {
    set((state) => {
      const isSelected = state.partnerSelectedTagIds.includes(id);
      return {
        partnerSelectedTagIds: isSelected
          ? state.partnerSelectedTagIds.filter(t => t !== id)
          : [...state.partnerSelectedTagIds, id]
      };
    });
    tgService.haptic('success');
  },

  addMoodTag: (newTag) => {
    const tag: TagDTO = {
      ...newTag,
      id: newTag.id || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'tag-temp')
    };
    set((state) => ({ moodTags: [...state.moodTags, tag] }));
    tgService.haptic('success');
  },

  updateMoodTag: (updatedTag) => {
    set((state) => ({ moodTags: state.moodTags.map(t => t.id === updatedTag.id ? updatedTag : t) }));
    tgService.haptic('success');
  },

  deleteMoodTag: (id) => {
    set((state) => ({ moodTags: state.moodTags.filter(t => t.id !== id) }));
    tgService.haptic('medium');
  },

  replaceMoodTag: (oldId, newTag) => {
    set((state) => ({
      moodTags: state.moodTags.map(t => (t.id === oldId ? newTag : t)),
      mySelectedTagIds: state.mySelectedTagIds.map(id => (id === oldId ? newTag.id : id)),
      partnerSelectedTagIds: state.partnerSelectedTagIds.map(id => (id === oldId ? newTag.id : id)),
    }));
  }
}));
