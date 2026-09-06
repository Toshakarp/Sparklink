import { useState } from 'react';
import type { DateCategoryDTO } from '@/shared/api/types/models';
import { usePlaceStore } from '@/entities/place';
import { useUserStore } from '@/entities/user';
import { useApi } from '@/app/providers/ApiProvider';
import type { DateCategoryFormData } from './types';

export const useDateCategoriesManager = () => {
  const {
    dateTags,
    addDateCategory,
    updateDateCategory,
    deleteDateCategory,
    replaceDateCategory,
  } = usePlaceStore();
  const currentUser = useUserStore((state) => state.currentUser);
  const { placesApi } = useApi();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<DateCategoryDTO | null>(null);

  const handleSaveAdd = async (data: DateCategoryFormData) => {
    const tempId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'temp-id';
    addDateCategory({
      id: tempId,
      label: data.label,
      emoji: data.emoji,
    });
    
    if (currentUser?.pairId && placesApi) {
      try {
        const created = await placesApi.createDateCategory(currentUser.pairId, data.label, data.emoji);
        replaceDateCategory(tempId, created);
      } catch (e) {
        console.error('Failed to create date category', e);
        deleteDateCategory(tempId); // rollback on error
      }
    }
    
    setIsAddModalOpen(false);
  };

  const handleSaveEdit = async (data: DateCategoryFormData) => {
    if (!editingTag) return;
    const originalTag = { ...editingTag };
    const updated = {
      ...editingTag,
      label: data.label,
      emoji: data.emoji,
    };
    
    updateDateCategory(updated);
    setEditingTag(null);
    
    if (placesApi) {
      try {
        await placesApi.updateDateCategory(updated);
      } catch (e) {
        console.error('Failed to update date category', e);
        updateDateCategory(originalTag); // rollback on error
      }
    }
  };
  
  const handleDelete = async (categoryId: string) => {
    const originalCategory = dateTags.find((t) => t.id === categoryId);
    deleteDateCategory(categoryId);
    setEditingTag(null);
    if (placesApi) {
      try {
        await placesApi.deleteDateCategory(categoryId);
      } catch (e) {
        console.error('Failed to delete date category', e);
        if (originalCategory) {
          addDateCategory(originalCategory); // rollback on error
        }
      }
    }
  };

  const customTags = dateTags.filter((t) => t.id !== 'all');

  return {
    customTags,
    isAddModalOpen,
    setIsAddModalOpen,
    editingTag,
    setEditingTag,
    handleSaveAdd,
    handleSaveEdit,
    handleDelete,
  };
};
