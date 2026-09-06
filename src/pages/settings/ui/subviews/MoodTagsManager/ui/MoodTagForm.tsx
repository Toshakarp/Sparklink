import { useState } from 'react';
import type { FC, FormEvent } from 'react';
import { FormField, FormActions, Input, EmojiPicker } from '@/shared/ui';
import { MoodAudiencePicker } from './MoodAudiencePicker';
import type { MoodTagFormData, MoodAudience } from '../models/types';
import styles from './MoodTagForm.module.scss';

export interface MoodTagFormProps {
  initialData?: Partial<MoodTagFormData>;
  submitLabel?: string;
  onSubmit: (data: MoodTagFormData) => void;
  onCancel?: () => void;
  onDelete?: () => void;
  deleteLabel?: string;
}

export const MoodTagForm: FC<MoodTagFormProps> = ({
  initialData,
  submitLabel = 'Сохранить',
  onSubmit,
  onCancel,
  onDelete,
  deleteLabel = 'Удалить тег',
}) => {
  const [label, setLabel] = useState(initialData?.label || '');
  const [emoji, setEmoji] = useState(initialData?.emoji || '✨');
  const [category, setCategory] = useState<MoodAudience>(
    initialData?.category || 'together'
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!label.trim()) return;

    onSubmit({
      label: label.trim(),
      emoji,
      category,
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

      <FormField label="Название тега настроения" required>
        <Input maxLength={30} showCount
          placeholder="Например: Хочу обнимашек, Нужен кофе..."
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          required
        />
      </FormField>

      <FormField label="Для кого подходит" required>
        <MoodAudiencePicker value={category} onChange={setCategory} />
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
