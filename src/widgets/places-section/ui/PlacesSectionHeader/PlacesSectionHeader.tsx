import type { FC } from 'react';
import { SlidersHorizontal, Plus } from 'lucide-react';
import { IconButton } from '@/shared/ui';
import styles from '../PlacesSection/PlacesSection.module.scss';

export interface PlacesSectionHeaderProps {
  count: number;
  hasActiveFilters: boolean;
  onOpenFilter: () => void;
  onOpenAddModal: () => void;
}

export const PlacesSectionHeader: FC<PlacesSectionHeaderProps> = ({
  count,
  hasActiveFilters,
  onOpenFilter,
  onOpenAddModal,
}) => {
  return (
    <div className={styles.header}>
      <div className={styles.titleGroup}>
        <h2 className={styles.title}>Все места и идеи</h2>
        <span className={styles.countBadge}>{count}</span>
      </div>

      <div className={styles.actions}>
        <IconButton
          variant="ghost"
          size="sm"
          onClick={onOpenFilter}
          aria-label="Фильтры"
          className={`${styles.filterBtn} ${hasActiveFilters ? styles.filterActive : ''}`}
        >
          <div className={styles.filterIconWrapper}>
            <SlidersHorizontal size={16} />
            {hasActiveFilters && <span className={styles.filterDot} />}
          </div>
        </IconButton>
        <IconButton
          variant="default"
          size="sm"
          onClick={onOpenAddModal}
          aria-label="Добавить место"
        >
          <Plus size={18} />
        </IconButton>
      </div>
    </div>
  );
};
