import type { FC } from 'react';
import { BudgetTag } from '@/entities/place';
import type {  BudgetTierDTO  } from '@/shared/api/types/models';
import styles from './BudgetPicker.module.scss';

export interface BudgetPickerProps {
  budgetTiers: BudgetTierDTO[];
  selectedBudgetIds?: string[];
  selectedBudgetId?: string; // used for single selection
  onToggleBudget?: (id: string) => void;
  onSelectBudget?: (id: string) => void; // used for single selection
}

export const BudgetPicker: FC<BudgetPickerProps> = ({
  budgetTiers,
  selectedBudgetIds,
  selectedBudgetId,
  onToggleBudget,
  onSelectBudget,
}) => {
  return (
    <div className={styles.picker}>
      {budgetTiers.map(tier => {
        const isSelected = selectedBudgetId ? tier.id === selectedBudgetId : selectedBudgetIds?.includes(tier.id);
        const handleClick = () => {
          if (onSelectBudget) onSelectBudget(tier.id);
          else if (onToggleBudget) onToggleBudget(tier.id);
        };
        
        return (
          <BudgetTag
            key={tier.id}
            budgetTier={tier}
            isActive={isSelected}
            onClick={handleClick}
          />
        );
      })}
    </div>
  );
};
