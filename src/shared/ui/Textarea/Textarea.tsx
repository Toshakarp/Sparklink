import type { TextareaHTMLAttributes, FC } from 'react';
import styles from './Textarea.module.scss';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
  maxLength?: number;
  showCount?: boolean;
}

export const Textarea: FC<TextareaProps> = ({
  className = '',
  maxLength,
  showCount,
  value,
  rows = 3,
  ...rest
}) => {
  const currentLength = value ? String(value).length : 0;

  return (
    <div className={styles.textareaWrapper}>
      <textarea
        className={`${styles.textarea} ${className}`.trim()}
        maxLength={maxLength}
        value={value}
        rows={rows}
        {...rest}
      />
      {showCount && maxLength && (
        <span className={styles.countBadge}>
          {currentLength}/{maxLength}
        </span>
      )}
    </div>
  );
};
