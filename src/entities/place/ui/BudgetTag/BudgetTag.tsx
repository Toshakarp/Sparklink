import React from 'react';
import type { FC } from 'react';
import { Tag, type TagProps } from '@/shared/ui';
import type { BudgetTierDTO } from '@/shared/api/mock';
import styles from './BudgetTag.module.scss';

export interface BudgetTagProps extends Omit<TagProps, 'title' | 'emoji'> {
  budgetTier: BudgetTierDTO;
}

export const BudgetTag: FC<BudgetTagProps> = ({
  budgetTier,
  isActive = false,
  className = '',
  ...props
}) => {
  const levelClass = styles[`level${budgetTier.colorLevel}`];
  
  const classes = [
    styles.budgetTag,
    isActive ? styles.isActive : '',
    levelClass,
    className,
  ].filter(Boolean).join(' ');

  return (
    <Tag
      title={budgetTier.name}
      emoji={budgetTier.emoji}
      className={classes}
      isActive={isActive}
      {...props}
    />
  );
};
