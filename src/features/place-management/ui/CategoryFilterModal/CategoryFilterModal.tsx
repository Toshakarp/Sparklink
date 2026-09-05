import type { TagDTO, BudgetTierDTO } from '@/shared/api/types/models';
import type { FC } from 'react';
import { Modal, Tag, FormActions } from '@/shared/ui';
import { BudgetPicker } from '@/entities';
import styles from './CategoryFilterModal.module.scss';

export interface CategoryFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  tags?: TagDTO[];
  budgetTiers?: BudgetTierDTO[];
  selectedTagIds?: string[];
  selectedBudgetIds?: string[];
  onToggleTag?: (tagId: string) => void;
  onToggleBudget?: (budgetId: string) => void;
  onApply?: (categoryIds: string[], budgetIds: string[]) => void;
  onResetFilters?: () => void;
}

export const CategoryFilterModal: FC<CategoryFilterModalProps> = ({
  isOpen,
  onClose,
  tags = [],
  budgetTiers = [],
  selectedTagIds = [],
  selectedBudgetIds = [],
  onToggleTag,
  onToggleBudget,
  onApply,
  onResetFilters,
}) => {
  const currentTags = tags.filter((t) => t.id !== 'all');
  const activeCount = selectedTagIds.length + selectedBudgetIds.length;

  const handleApply = () => {
    if (onApply) {
      onApply(selectedTagIds, selectedBudgetIds);
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Фильтры мест и идей">
      <div className={styles.container}>
        {currentTags.length > 0 && onToggleTag && (
          <div className={styles.section}>
            <div className={styles.sectionTitle}>Категории свиданий</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {currentTags.map((tag) => {
                const isSelected = selectedTagIds.includes(tag.id);
                return (
                  <Tag
                    key={tag.id}
                    label={tag.label}
                    isActive={isSelected}
                    onClick={() => onToggleTag(tag.id)}
                  />
                );
              })}
            </div>
          </div>
        )}

        {budgetTiers.length > 0 && onToggleBudget && (
          <div className={styles.section}>
            <div className={styles.sectionTitle}>Уровень бюджета</div>
            <BudgetPicker
              budgetTiers={budgetTiers}
              selectedBudgetIds={selectedBudgetIds}
              onToggleBudget={onToggleBudget}
            />
          </div>
        )}

        <FormActions
          submitLabel={`Применить${activeCount > 0 ? ` (${activeCount})` : ''}`}
          onSubmit={handleApply}
          onCancel={onClose}
          cancelLabel="Закрыть"
          onDelete={activeCount > 0 ? onResetFilters : undefined}
          deleteLabel="Сбросить все фильтры"
          deleteVariant="ghost"
        />
      </div>
    </Modal>
  );
};
