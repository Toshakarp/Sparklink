import type { BudgetTierDTO } from '@/shared/api/types/models';
import { useState, useCallback } from 'react';
import type { FormEvent } from 'react';

export interface PlaceFormData {
  title: string;
  emoji: string;
  address?: string;
  description?: string;
  tagIds?: string[];
  budgetId?: string;
}

export interface UsePlaceFormOptions {
  initialData?: Partial<PlaceFormData>;
  budgetTiers?: BudgetTierDTO[];
  onSubmit: (data: PlaceFormData) => void;
}

export const usePlaceForm = ({
  initialData,
  budgetTiers = [],
  onSubmit,
}: UsePlaceFormOptions) => {
  const [prevInitialData, setPrevInitialData] = useState(initialData);
  const [emoji, setEmoji] = useState(initialData?.emoji || '☕️');
  const [title, setTitle] = useState(initialData?.title || '');
  const [address, setAddress] = useState(initialData?.address || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(
    initialData?.tagIds || []
  );
  const [selectedBudgetId, setSelectedBudgetId] = useState<string | undefined>(
    initialData?.budgetId || budgetTiers[0]?.id
  );

  if (initialData !== prevInitialData) {
    setPrevInitialData(initialData);
    if (initialData) {
      if (initialData.emoji) setEmoji(initialData.emoji);
      if (initialData.title) setTitle(initialData.title);
      if (initialData.address !== undefined) setAddress(initialData.address || '');
      if (initialData.description !== undefined) setDescription(initialData.description || '');
      if (initialData.tagIds) setSelectedTagIds(initialData.tagIds);
      if (initialData.budgetId) setSelectedBudgetId(initialData.budgetId);
    }
  }

  const handleToggleTag = useCallback((tagId: string) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  }, []);

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      if (!title.trim()) return;

      onSubmit({
        title: title.trim(),
        emoji,
        address: address.trim() || undefined,
        description: description.trim() || undefined,
        tagIds: selectedTagIds,
        budgetId: selectedBudgetId,
      });
    },
    [title, emoji, address, description, selectedTagIds, selectedBudgetId, onSubmit]
  );

  return {
    emoji,
    setEmoji,
    title,
    setTitle,
    address,
    setAddress,
    description,
    setDescription,
    selectedTagIds,
    handleToggleTag,
    selectedBudgetId,
    setSelectedBudgetId,
    handleSubmit,
    isValid: Boolean(title.trim()),
  };
};
