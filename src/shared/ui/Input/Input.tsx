import type { InputHTMLAttributes, FC } from 'react';
import styles from './Input.module.scss';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export const Input: FC<InputProps> = ({ className = '', ...rest }) => {
  return (
    <input
      className={`${styles.input} ${className}`.trim()}
      {...rest}
    />
  );
};
