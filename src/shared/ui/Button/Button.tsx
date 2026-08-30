import React from 'react';
import { useGlowing } from '@/shared/lib/hooks/useGlowing';
import styles from './Button.module.scss';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'danger' | 'ghost' | 'attention' | 'confirm' | 'warning' | 'secondary' | 'counter';
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'secondary',
  children,
  onClick,
  disabled = false,
  fullWidth = false,
  icon,
  className = '',
  type = 'button',
  ...props
}) => {
  const { isGlowing, triggerGlow } = useGlowing(5000);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    triggerGlow();
    onClick?.(e);
  };

  const buttonClasses = [
    styles.button,
    styles[variant],
    fullWidth ? styles.fullWidth : '',
    isGlowing ? styles.glowing : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      className={buttonClasses}
      onClick={handleClick}
      disabled={disabled}
      type={type}
      {...props}
    >
      {icon && <span className={styles.icon}>{icon}</span>}
      {children && <span>{children}</span>}
    </button>
  );
};
