import { useState } from 'react';
import type { ButtonHTMLAttributes, FC, MouseEvent, ReactNode } from 'react';
import { Check } from 'lucide-react';
import styles from './Tag.module.scss';

export interface TagProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
  emoji?: string;
  isActive?: boolean;
  addonRight?: ReactNode;
}

export const Tag: FC<TagProps> = ({
  title,
  emoji,
  isActive = false,
  addonRight,
  onClick,
  className = '',
  ...props
}) => {
  const [isTapped, setIsTapped] = useState(false);

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    setIsTapped(true);
    setTimeout(() => setIsTapped(false), 300);
    onClick?.(e);
  };

  const tagClasses = [
    styles.tag,
    isActive ? styles.tagActive : '',
    isTapped ? styles.tapPulse : '',
    className,
  ].filter(Boolean).join(' ');

  const rightElement = addonRight || (isActive ? <Check size={14} className={styles.checkIcon} /> : null);

  return (
    <button
      className={tagClasses}
      onClick={handleClick}
      type="button"
      {...props}
    >
      {emoji && <span className={styles.emoji}>{emoji}</span>}
      <span className={styles.title}>{title}</span>
      {rightElement}
    </button>
  );
};