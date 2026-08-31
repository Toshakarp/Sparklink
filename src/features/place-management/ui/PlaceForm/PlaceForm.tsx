import type { FC } from 'react';
import { FormField, FormActions, Input, EmojiPicker } from '@/shared/ui';
import { BudgetPicker } from '@/entities';
import type { BudgetTierDTO, TagDTO } from '@/shared/api/mock';
import { usePlaceForm, type PlaceFormData } from '../../model/usePlaceForm';
import { TagPicker } from '@/shared/ui';
import styles from './PlaceForm.module.scss';

export type { PlaceFormData };

export interface PlaceFormProps {
  initialData?: Partial<PlaceFormData>;
  dateTags?: TagDTO[];
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
  const {
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
    isValid,
  } = usePlaceForm({
    initialData,
    budgetTiers,
    onSubmit,
  });

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
        <Input maxLength={40} showCount
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

      <FormField label="Адрес / локация">
        <Input maxLength={60} showCount
          placeholder="ул. Примерная, 10 или станция метро"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </FormField>

      <FormField label="Заметки и детали">
        <textarea
          className={styles.textarea}
          placeholder="Что взять с собой, промокоды, столик у окна..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
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
