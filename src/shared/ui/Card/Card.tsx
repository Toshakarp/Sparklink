import React from 'react';
import { useGlowing } from '@/shared/lib/hooks/useGlowing';
import styles from './Card.module.scss';

export type GlowColorType = 
  | 'none'
  | 'green'
  | 'pink'
  | 'warning'
  | 'blue'
  | 'partner'
  | 'mood-1'
  | 'mood-2'
  | 'mood-3'
  | 'mood-4'
  | 'mood-5';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'square' | 'small' | 'big';
  glowColor?: GlowColorType;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'small',
  glowColor = 'none',
  onClick,
  className = '',
  ...restProps
}) => {
  const { isGlowing, triggerGlow } = useGlowing(5000);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (glowColor !== 'none') {
      triggerGlow();
    }
    onClick?.(e);
  };

  const cardClasses = [
    styles.card,
    styles[variant],
    onClick ? styles.clickable : '',
    isGlowing && glowColor !== 'none' ? styles[`glow_${glowColor}`] : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={cardClasses} onClick={handleClick} {...restProps}>
      {children}
    </div>
  );
};
