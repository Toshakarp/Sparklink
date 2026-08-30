import React from 'react';
import type { FC, MouseEvent } from 'react';
import { Card, TagList } from '@/shared/ui';
import { BudgetTag } from '../BudgetTag/BudgetTag';
import { PlaceLikeButton } from '../PlaceLikeButton/PlaceLikeButton';
import { usePlaceStore } from '../../model/usePlaceStore';
import type { PlaceDTO, BudgetTierDTO, TagDTO } from '@/shared/api/mock/types';
import styles from './PlaceCard.module.scss';

export interface PlaceCardProps {
  place: PlaceDTO;
  budgetTier?: BudgetTierDTO;
  tags?: TagDTO[];
  onClick?: () => void;
}

export const PlaceCard: FC<PlaceCardProps> = ({
  place,
  budgetTier,
  tags = [],
  onClick,
}) => {
  const isLikedByMe = usePlaceStore((state) => state.likedPlaceIds.includes(place.id));
  const incrementCount = usePlaceStore((state) => state.incrementCount);
  const clickCount = place.clickCount || 0;

  const handleLike = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (!isLikedByMe) {
      incrementCount(place.id);
    }
  };

  const subtitle = place.address || place.description;

  return (
    <Card className={styles.card} onClick={onClick}>
      <div className={styles.topRow}>
        <div className={styles.emojiBox}>{place.emoji || '🍿'}</div>
        <div className={styles.contentBox}>
          <div className={styles.title}>{place.title}</div>
          {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
        </div>

        <div
          className={styles.likeWrapper}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
        >
          <PlaceLikeButton
            clickCount={clickCount}
            isVisited={isLikedByMe}
            disabled={isLikedByMe}
            onClick={handleLike}
          />
        </div>
      </div>

      {(budgetTier || (tags && tags.length > 0)) && (
        <div className={styles.badgesRow}>
          {budgetTier && <BudgetTag budgetTier={budgetTier} />}
          {tags && tags.length > 0 && <TagList tags={tags} />}
        </div>
      )}
    </Card>
  );
};
