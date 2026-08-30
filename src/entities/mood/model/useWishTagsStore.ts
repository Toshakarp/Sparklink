import { create } from 'zustand';
import { moodService } from "../api/moodService";
import type { TagDTO } from '@/shared/api/mock/types';
import { tgService } from '@/shared/lib/telegram/telegram';

interface WishTagsState {
  moodTags: TagDTO[];
  isLoading: boolean;
  fetchTags: () => Promise<void>;
  toggleMoodTag: (tagId: string) => void;
  addMoodTag: (tag: Omit<TagDTO, 'id'>) => void;
  updateMoodTag: (tag: TagDTO) => void;
  deleteMoodTag: (id: string) => void;
}

export const useWishTagsStore = create<WishTagsState>((set) => ({
  moodTags: [],
  isLoading: false,

  fetchTags: async () => {
    set({ isLoading: true });
    try {
      const tags = await moodService.getMoodTags();
      set({ moodTags: tags, isLoading: false });
    } catch (e) {
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
    const newTag: TagDTO = { ...tag, id: `tag-${Date.now()}`, type: 'mood', markedBy: [], selectedByMe: false, selectedByPartner: false };
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
