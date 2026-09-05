import type { UserDTO } from '@/shared/api/types/models';
import { useState } from 'react';
import type { FC } from 'react';
import { ImageOff, Plus } from 'lucide-react';
import { Card } from '@/shared/ui';
import { UserAvatar } from '@/entities/user';
import styles from './LockItPhotoCard.module.scss';

export interface LockItPhotoCardProps {
  user: UserDTO;
  photoUrl?: string | null;
  photoTime?: string | null;
  isCurrentUser?: boolean;
  onCardClick?: () => void;
  emptyLabel?: string;
  className?: string;
}

export const LockItPhotoCard: FC<LockItPhotoCardProps> = ({
  user,
  photoUrl,
  photoTime,
  isCurrentUser = false,
  onCardClick,
  emptyLabel,
  className = '',
}) => {
  const [hasError, setHasError] = useState(false);
  const hasPhoto = Boolean(photoUrl) && !hasError;

  const defaultLabel = isCurrentUser
    ? (emptyLabel || 'Загрузить фото момента')
    : (emptyLabel || 'Партнер еще не добавил фото');

  return (
    <Card
      className={`${styles.card} ${className}`.trim()}
      onClick={onCardClick}
    >
      <div className={styles.avatarBadge}>
        <UserAvatar user={user} size="small" isPartner={!isCurrentUser} />
      </div>

      {hasPhoto && photoUrl ? (
        <div className={styles.photoWrapper}>
          <img
            src={photoUrl}
            alt="Момент дня"
            className={styles.photo}
            referrerPolicy="no-referrer"
            onError={() => setHasError(true)}
          />
          <div className={styles.overlayGradient} />
          {photoTime && (
            <div className={styles.timeBadge}>
              <span>{photoTime}</span>
            </div>
          )}
        </div>
      ) : hasError ? (
        <div className={styles.photoFallback}>
          <ImageOff size={24} />
          <span className={styles.fallbackText}>Не удалось загрузить фото</span>
        </div>
      ) : (
        <div className={styles.placeholder}>
          {isCurrentUser && (
            <div className={styles.placeholderIconBox}>
              <Plus size={18} />
            </div>
          )}
          <span className={styles.placeholderText}>{defaultLabel}</span>
        </div>
      )}
    </Card>
  );
};
