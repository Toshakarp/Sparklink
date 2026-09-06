import type { PlaceDTO, TagDTO, DateCategoryDTO, BudgetTierDTO } from '@/shared/api/types/models';
import type { FC, MouseEvent } from 'react';
import { Card, TagList } from '@/shared/ui';
import { BudgetTag } from '../BudgetTag/BudgetTag';
import { PlaceLikeButton } from '../PlaceLikeButton/PlaceLikeButton';
import { usePlaceStore } from '../../model/usePlaceStore';
import { getBudgetTier } from '../../lib/budgetHelpers';
import { useApi } from '@/app/providers/ApiProvider';
import styles from './PlaceCard.module.scss';

export interface PlaceCardProps {
  place: PlaceDTO;
  budgetTier?: BudgetTierDTO;
  tags?: (TagDTO | DateCategoryDTO)[];
  onClick?: () => void;
}

export const PlaceCard: FC<PlaceCardProps> = ({
  place,
  budgetTier,
  tags,
  onClick,
}) => {
  const isLikedByMe = usePlaceStore((state) => state.likedPlaceIds.includes(place.id));
  const incrementCount = usePlaceStore((state) => state.incrementCount);
  const rollbackIncrementCount = usePlaceStore((state) => state.rollbackIncrementCount);
  const dateTags = usePlaceStore((state) => state.dateTags);
  const budgetTiers = usePlaceStore((state) => state.budgetTiers);
  const { placesApi } = useApi();

  const resolvedBudgetTier = budgetTier || getBudgetTier(place.budgetId, budgetTiers);
  const resolvedTags = tags !== undefined ? tags : dateTags.filter((t) => place.categoryIds?.includes(t.id));

  const clickCount = place.clickCount || 0;

  const handleLike = async (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (isLikedByMe) return;

    const originalClickCount = place.clickCount || 0;
    const originalLastClickedAt = place.lastClickedAt || null;

    incrementCount(place.id);

    if (placesApi) {
      try {
        await placesApi.updatePlace({
          ...place,
          clickCount: originalClickCount + 1,
          lastClickedAt: new Date().toISOString(),
        });
      } catch (err) {
        console.error('Failed to update place like in DB', err);
        rollbackIncrementCount(place.id, originalClickCount, originalLastClickedAt);
      }
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

      {(resolvedBudgetTier || (resolvedTags && resolvedTags.length > 0)) && (
        <div className={styles.badgesRow}>
          {resolvedBudgetTier && <BudgetTag budgetTier={resolvedBudgetTier} />}
          {resolvedTags && resolvedTags.length > 0 && <TagList tags={resolvedTags} />}
        </div>
      )}
    </Card>
  );
};
