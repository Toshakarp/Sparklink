import React from 'react';
import type { FC } from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '../Button/Button';
import styles from './FormActions.module.scss';

export interface FormActionsProps {
  submitLabel: string;
  isSubmitDisabled?: boolean;
  onSubmit?: () => void;
  onCancel?: () => void;
  cancelLabel?: string;
  onDelete?: () => void;
  deleteLabel?: string;
  deleteVariant?: 'danger' | 'ghost' | 'secondary';
  className?: string;
}

export const FormActions: FC<FormActionsProps> = ({
  submitLabel,
  isSubmitDisabled = false,
  onSubmit,
  onCancel,
  cancelLabel = 'Отмена',
  onDelete,
  deleteLabel = 'Удалить',
  deleteVariant = 'danger',
  className = '',
}) => {
  return (
    <div className={`${styles.actions} ${className}`.trim()}>
      <Button
        type={onSubmit ? 'button' : 'submit'}
        variant="primary"
        fullWidth
        disabled={isSubmitDisabled}
        onClick={onSubmit}
        className={styles.submitBtn}
      >
        {submitLabel}
      </Button>

      {onCancel && (
        <Button
          type="button"
          variant="secondary"
          fullWidth
          onClick={onCancel}
          className={styles.cancelBtn}
        >
          {cancelLabel}
        </Button>
      )}

      {onDelete && (
        <Button
          type="button"
          variant={deleteVariant}
          fullWidth
          onClick={onDelete}
          className={styles.deleteBtn}
          icon={deleteVariant === 'danger' ? <Trash2 size={16} /> : undefined}
        >
          {deleteLabel}
        </Button>
      )}
    </div>
  );
};
