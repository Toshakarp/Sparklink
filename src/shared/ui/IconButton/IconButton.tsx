import type { ButtonHTMLAttributes, FC, ReactNode } from 'react';
import styles from './IconButton.module.scss';

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: ReactNode;
  children?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  shape?: 'round' | 'square' | 'pill';
  variant?: 'default' | 'ghost' | 'danger' | 'accent';
  isActive?: boolean;
}

export const IconButton: FC<IconButtonProps> = ({
  icon,
  children,
  size = 'md',
  shape = 'round',
  variant = 'default',
  isActive = false,
  className = '',
  ...rest
}) => {
  const classes = [
    styles.iconButton,
    styles[size],
    styles[shape],
    variant !== 'default' ? styles[variant] : '',
    isActive ? styles.active : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={classes} type="button" {...rest}>
      {icon}
      {children}
    </button>
  );
};
