import type { FC, ReactNode } from 'react';
import styles from './FormField.module.scss';

export interface FormFieldProps {
  label: string;
  required?: boolean;
  children: ReactNode;
}

export const FormField: FC<FormFieldProps> = ({
  label,
  required = false,
  children,
}) => {
  return (
    <div className={styles.fieldGroup}>
      <label className={styles.label}>
        {label}
        {required && <span className={styles.requiredStar}> *</span>}
      </label>
      {children}
    </div>
  );
};
