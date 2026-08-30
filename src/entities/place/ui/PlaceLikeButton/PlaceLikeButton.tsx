import React from 'react';
import type { FC, MouseEvent } from 'react';
import { Heart } from 'lucide-react';
import { IconButton } from '@/shared/ui';
import styles from './PlaceLikeButton.module.scss';

export interface PlaceLikeButtonProps {
  clickCount?: number;
  isVisited?: boolean;
  disabled?: boolean;
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
  className?: string;
}

export const PlaceLikeButton: FC<PlaceLikeButtonProps> = ({
  clickCount = 0,
  isVisited = false,
  disabled = false,
  onClick,
  className = '',
}) => {
  const visited = Boolean(isVisited);
  const isDisabled = Boolean(disabled || isVisited);

  return (
    <IconButton
      shape="pill"
      size="sm"
      disabled={isDisabled}
      onClick={onClick}
      onMouseDown={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
      className={[
        styles.likeButton,
        visited ? styles.visited : '',
        className,
      ].filter(Boolean).join(' ')}
      aria-label={visited ? 'Уже были здесь' : 'Отметить посещение'}
    >
      <Heart
        size={14}
        className={[styles.heartIcon, visited ? styles.visitedHeart : ''].filter(Boolean).join(' ')}
        fill={visited ? 'currentColor' : 'none'}
      />
      <span className={styles.likeCount}>{clickCount}</span>
    </IconButton>
  );
};
