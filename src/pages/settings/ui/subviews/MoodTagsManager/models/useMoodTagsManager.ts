import { useState } from 'react';
import type { TagDTO } from '@/shared/api/types/models';
import { useWishTagsStore } from '@/entities/mood';
import { useUserStore } from '@/entities/user';
import { useApi } from '@/app/providers/ApiProvider';
import type { MoodTagFormData } from './types';

export const useMoodTagsManager = () => {
  const { moodTags, addMoodTag, updateMoodTag, deleteMoodTag, replaceMoodTag } = useWishTagsStore();
  const currentUser = useUserStore((state) => state.currentUser);
  const { pairApi } = useApi();
  const [editingTag, setEditingTag] = useState<TagDTO | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleAddSubmit = async (data: MoodTagFormData) => {
    const audience = data.category;
    
    // UI optimistic update
    const tempId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'temp-id';
    addMoodTag({
      id: tempId,
      label: data.label,
      emoji: data.emoji,
      audience,
    });
    
    if (currentUser?.pairId && pairApi) {
      try {
        const created = await pairApi.createMoodTag(currentUser.pairId, data.label, data.emoji, audience);
        replaceMoodTag(tempId, created);
      } catch (e) {
        console.error('Failed to create mood tag in API', e);
        deleteMoodTag(tempId); // rollback on error
      }
    }
    setIsAddModalOpen(false);
  };

  const handleEditSubmit = async (data: MoodTagFormData) => {
    if (!editingTag) return;
    const originalTag = { ...editingTag };
    const updatedTag: TagDTO = {
      ...editingTag,
      label: data.label,
      emoji: data.emoji,
      audience: data.category,
    };

    updateMoodTag(updatedTag);
    setEditingTag(null);

    if (pairApi) {
      try {
        await pairApi.updateMoodTag(updatedTag);
      } catch (e) {
        console.error('Failed to update mood tag in API', e);
        updateMoodTag(originalTag); // rollback on error
      }
    }
  };

  const handleDelete = async (tagId: string) => {
    const originalTag = moodTags.find((t) => t.id === tagId);
    deleteMoodTag(tagId);
    setEditingTag(null);

    if (pairApi) {
      try {
        await pairApi.deleteMoodTag(tagId);
      } catch (e) {
        console.error('Failed to delete mood tag from API', e);
        if (originalTag) {
          addMoodTag(originalTag); // rollback on error
        }
      }
    }
  };

  return {
    moodTags,
    editingTag,
    setEditingTag,
    isAddModalOpen,
    setIsAddModalOpen,
    handleAddSubmit,
    handleEditSubmit,
    handleDelete,
  };
};
