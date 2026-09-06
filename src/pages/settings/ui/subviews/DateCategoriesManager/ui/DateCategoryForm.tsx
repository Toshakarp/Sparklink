import { useState } from 'react';
import type { FC, FormEvent } from 'react';
import { FormField, FormActions, Input, EmojiPicker } from '@/shared/ui';
import type { DateCategoryFormData } from '../models/types';
import styles from './DateCategoryForm.module.scss';

export interface DateCategoryFormProps {
  initialData?: Partial<DateCategoryFormData>;
  submitLabel?: string;
  onSubmit: (data: DateCategoryFormData) => void;
  onCancel?: () => void;
  onDelete?: () => void;
  deleteLabel?: string;
}

export const DateCategoryForm: FC<DateCategoryFormProps> = ({
  initialData,
  submitLabel = 'Сохранить',
  onSubmit,
  onCancel,
  onDelete,
  deleteLabel = 'Удалить категорию',
}) => {
  const [label, setLabel] = useState(initialData?.label || '');
  const [emoji, setEmoji] = useState(initialData?.emoji || '✨');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!label.trim()) return;

    onSubmit({
      label: label.trim(),
      emoji,
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

      <FormField label="Название категории" required>
        <Input maxLength={30} showCount
          placeholder="Например: Романтика, Активный отдых..."
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          required
        />
      </FormField>

      <FormActions
        submitLabel={submitLabel}
        isSubmitDisabled={!label.trim()}
        onCancel={onCancel}
        onDelete={onDelete}
        deleteLabel={deleteLabel}
      />
    </form>
  );
};
