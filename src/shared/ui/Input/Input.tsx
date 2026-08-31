import type { InputHTMLAttributes, FC } from 'react';
import styles from './Input.module.scss';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  maxLength?: number;
  showCount?: boolean;
}

export const Input: FC<InputProps> = ({ className = '', maxLength, showCount, value, ...rest }) => {
  const currentLength = value ? String(value).length : 0;

  return (
    <div className={styles.inputWrapper}>
      <input
        className={`${styles.input} ${className}`.trim()}
        maxLength={maxLength}
        value={value}
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
