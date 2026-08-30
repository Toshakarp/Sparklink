import React from 'react';
import type { FC } from 'react';
import { Heart } from 'lucide-react';
import { Modal, Card, Button } from '@/shared/ui';
import type { PlaceDTO } from '@/shared/api/mock/types';
import { usePlaceStore, getBudgetTier } from '@/entities/place';
import { PlaceDetailHero } from './PlaceDetailHero';
import { PlaceDetailMeta } from './PlaceDetailMeta';
import styles from './PlaceDetailModal.module.scss';

export interface PlaceDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  place: PlaceDTO | null;
  onEdit?: (place: PlaceDTO) => void;
}

export const PlaceDetailModal: FC<PlaceDetailModalProps> = ({
  isOpen,
  onClose,
  place,
  onEdit,
}) => {
  const likedPlaceIds = usePlaceStore(state => state.likedPlaceIds);
  const onIncrementClick = usePlaceStore(state => state.incrementCount);
  const budgetTiers = usePlaceStore(state => state.budgetTiers);
  const allTags = usePlaceStore(state => state.dateTags);
  const livePlace = usePlaceStore(state => state.dateIdeas.find(p => p.id === place?.id)) || place;

  if (!livePlace) return null;

  const isLikedByMe = likedPlaceIds.includes(livePlace.id);
  const budgetTier = livePlace.budgetId ? getBudgetTier(livePlace.budgetId, budgetTiers) : undefined;
  const tags = allTags.filter(t => livePlace.tagIds?.includes(t.id));
  const clickCount = livePlace.clickCount || 0;

  const handleIncrement = () => {
    if (isLikedByMe) return;
    onIncrementClick(livePlace.id);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={livePlace.title}>
      <div className={styles.modalContent}>
        <PlaceDetailHero
          emoji={livePlace.emoji}
          title={livePlace.title}
          address={livePlace.address}
        />

        {livePlace.description && (
          <Card className={styles.descCard}>
            <div className={styles.descTitle}>Заметки и описание</div>
            <div className={styles.descText}>{livePlace.description}</div>
          </Card>
        )}

        <PlaceDetailMeta budgetTier={budgetTier} tags={tags} />

        <div className={styles.actions}>
          <Button
            type="button"
            variant={isLikedByMe ? 'secondary' : 'primary'}
            fullWidth
            disabled={isLikedByMe}
            onClick={handleIncrement}
            className={`${styles.likeBtn} ${isLikedByMe ? styles.likedPulse : ''}`}
            icon={
              <Heart
                size={16}
                className={isLikedByMe ? styles.heartActive : ''}
                fill={isLikedByMe ? 'currentColor' : 'none'}
              />
            }
          >
            {isLikedByMe ? `Были здесь (${clickCount})` : clickCount > 0 ? `Были здесь! (${clickCount})` : 'Были здесь!'}
          </Button>

          {onEdit && (
            <Button
              type="button"
              variant="secondary"
              fullWidth
              onClick={() => {
                onClose();
                onEdit(livePlace);
              }}
            >
              Редактировать
            </Button>
          )}

          <Button type="button" variant="ghost" fullWidth onClick={onClose}>
            Закрыть
          </Button>
        </div>
      </div>
    </Modal>
  );
};
