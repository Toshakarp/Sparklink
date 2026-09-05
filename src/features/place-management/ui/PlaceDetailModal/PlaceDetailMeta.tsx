import type { TagDTO, DateCategoryDTO, BudgetTierDTO } from '@/shared/api/types/models';
import type { FC } from 'react';
import { TagList } from '@/shared/ui';
import { BudgetTag } from "@/entities/place";
import styles from './PlaceDetailModal.module.scss';

export interface PlaceDetailMetaProps {
  budgetTier?: BudgetTierDTO;
  tags?: (TagDTO | DateCategoryDTO)[];
}

export const PlaceDetailMeta: FC<PlaceDetailMetaProps> = ({
  budgetTier,
  tags = [],
}) => {
  if (!budgetTier && tags.length === 0) return null;

  return (
    <div className={styles.metaSection}>
      {budgetTier && (
        <div className={styles.metaRow}>
          <span className={styles.metaLabel}>Бюджет:</span>
          <BudgetTag budgetTier={budgetTier} />
        </div>
      )}
      {tags.length > 0 && (
        <div className={styles.tagsRow}>
          <TagList tags={tags} />
        </div>
      )}
    </div>
  );
};
