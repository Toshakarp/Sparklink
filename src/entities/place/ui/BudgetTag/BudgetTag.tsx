import type { BudgetTierDTO } from '@/shared/api/types/models';
import type { FC } from 'react';
import { Tag, type TagProps } from '@/shared/ui';
import styles from './BudgetTag.module.scss';

export interface BudgetTagProps extends Omit<TagProps, 'label' | 'emoji'> {
  budgetTier: BudgetTierDTO;
}

export const BudgetTag: FC<BudgetTagProps> = ({
  budgetTier,
  isActive = false,
  className = '',
  ...props
}) => {
  const levelClass = styles[`level${budgetTier.level}`];
  
  const classes = [
    styles.budgetTag,
    isActive ? styles.isActive : '',
    levelClass,
    className,
  ].filter(Boolean).join(' ');

  return (
    <Tag
      label={budgetTier.label}
      className={classes}
      isActive={isActive}
      {...props}
    />
  );
};
