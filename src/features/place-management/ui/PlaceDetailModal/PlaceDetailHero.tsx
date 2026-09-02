import type { FC } from 'react';
import { MapPin } from 'lucide-react';
import styles from './PlaceDetailModal.module.scss';

export interface PlaceDetailHeroProps {
  emoji?: string;
  title: string;
  address?: string;
}

export const PlaceDetailHero: FC<PlaceDetailHeroProps> = ({
  emoji,
  title,
  address,
}) => {
  return (
    <div className={styles.heroSection}>
      <div className={styles.emojiLarge}>{emoji || '🍿'}</div>
      <div className={styles.titleLarge}>{title}</div>
      {address && (
        <div className={styles.addressRow}>
          <MapPin size={15} className={styles.addressIcon} />
          <span className={styles.addressText}>{address}</span>
        </div>
      )}
    </div>
  );
};
