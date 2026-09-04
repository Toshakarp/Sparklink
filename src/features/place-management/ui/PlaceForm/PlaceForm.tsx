import React from 'react';
import type { FC } from 'react';
import { FormField, FormActions, Input, Textarea, EmojiPicker, TagPicker } from '@/shared/ui';
import { BudgetPicker } from '@/entities';
import type { BudgetTierDTO, CreatePlaceDTO, DateCategoryDTO } from '@/shared/api/types/models';

import styles from './PlaceForm.module.scss';

export type PlaceFormData = CreatePlaceDTO;

export interface PlaceFormProps {
  initialData?: Partial<PlaceFormData>;
  dateTags?: DateCategoryDTO[];
  budgetTiers?: BudgetTierDTO[];
  submitLabel?: string;
  onSubmit: (data: PlaceFormData) => void;
  onCancel?: () => void;
  onDelete?: () => void;
  deleteLabel?: string;
}

export const PlaceForm: FC<PlaceFormProps> = ({
  initialData,
  dateTags = [],
  budgetTiers = [],
  submitLabel = 'Сохранить',
  onSubmit,
  onCancel,
  onDelete,
  deleteLabel = 'Удалить место',
}) => {
  const [emoji, setEmoji] = React.useState(initialData?.emoji || '📍');
  const [title, setTitle] = React.useState(initialData?.title || '');
  const [address, setAddress] = React.useState(initialData?.address || '');
  const [description, setDescription] = React.useState(initialData?.description || '');
  const [selectedTagIds, setSelectedTagIds] = React.useState<string[]>(initialData?.categoryIds || []);
  const [selectedBudgetId, setSelectedBudgetId] = React.useState<string | undefined>(initialData?.budgetId);

  const isValid = title.trim().length > 0 && selectedTagIds.length > 0;

  const handleToggleTag = (tagId: string) => {
    setSelectedTagIds(prev => 
      prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    
    onSubmit({
      title: title.trim(),
      emoji,
      address: address.trim() || undefined,
      description: description.trim() || undefined,
      categoryIds: selectedTagIds,
      budgetId: selectedBudgetId,
    });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <FormField label="Иконка (эмодзи)">
        <EmojiPicker
          selectedEmoji={emoji}
          onSelectEmoji={setEmoji}
          initialEmoji={initialData?.emoji}
        />
      </FormField>

      <FormField label="Название места" required>
        <Input 
          maxLength={40} 
          showCount
          placeholder="Например: Уютное кафе на набережной"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </FormField>

      {dateTags.length > 0 && (
        <FormField label="Категории">
          <TagPicker
            tags={dateTags}
            selectedTagIds={selectedTagIds}
            onToggleTag={handleToggleTag}
          />
        </FormField>
      )}

      {budgetTiers.length > 0 && (
        <FormField label="Ценовой диапазон">
          <BudgetPicker
            selectedBudgetId={selectedBudgetId}
            onSelectBudget={setSelectedBudgetId}
            budgetTiers={budgetTiers}
          />
        </FormField>
      )}

            <FormField label="Адрес или ссылка на карты">
        <Input 
          maxLength={80} 
          showCount
          placeholder="Например: ул. Пушкина, 10 или метро Арбатская"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </FormField>

      <FormField label="Заметки и описание">
        <Textarea 
          maxLength={300} 
          showCount
          rows={3}
          placeholder="Например: Заказать столик у окна, попробовать матча-латте"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </FormField>

      <FormActions
        submitLabel={submitLabel}
        isSubmitDisabled={!isValid}
        onCancel={onCancel}
        onDelete={onDelete}
        deleteLabel={deleteLabel}
      />
    </form>
  );
};
