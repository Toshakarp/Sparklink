import type { FC } from 'react';
import { Pencil, Check } from 'lucide-react';
import { SettingsSubViewHeader } from '../../SettingsSubViewHeader';
import { Card, Input, Button, IconButton } from '@/shared/ui';
import { BudgetTag } from '@/entities/place';
import { useBudgetManager } from '../models/useBudgetManager';
import styles from './BudgetManagerView.module.scss';

export interface BudgetManagerViewProps {
  onBack: () => void;
}

export const BudgetManagerView: FC<BudgetManagerViewProps> = ({ onBack }) => {
  const {
    localTiers,
    editingTierId,
    handleRangeChange,
    handleToggleEdit,
    handleSaveAll,
  } = useBudgetManager(onBack);

  return (
    <div className={styles.container}>
      <SettingsSubViewHeader title="Категории бюджета" onBack={onBack} />

      <div className={styles.content}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTitle}>Диапазоны стоимости</span>
          <span className={styles.sectionDesc}>
            Укажите привычные для вашей пары суммы для каждого уровня
          </span>
        </div>

        <div className={styles.list}>
          {localTiers.map((tier) => {
            const isEditing = editingTierId === tier.id;

            return (
              <Card key={tier.id} className={styles.tierCard}>
                <div className={styles.mainRow}>
                  <div className={styles.tagWrapper}>
                    <BudgetTag budgetTier={tier} />
                  </div>

                  <div className={styles.rangeInfo}>
                    <span className={styles.rangeText}>
                      {tier.rangeLabel || 'Не указан'}
                    </span>
                  </div>

                  <IconButton
                    size="sm"
                    shape="round"
                    variant="ghost"
                    onClick={() => handleToggleEdit(tier.id)}
                    aria-label="Изменить диапазон"
                    className={isEditing ? styles.activeEditBtn : ''}
                  >
                    {isEditing ? <Check size={16} /> : <Pencil size={16} />}
                  </IconButton>
                </div>

                {isEditing && (
                  <div className={styles.editRow}>
                    <Input
                      placeholder="Например: до 1 000 ₽ или 10 000+ ₽"
                      value={tier.rangeLabel || ''}
                      onChange={(e) => handleRangeChange(tier.id, e.target.value)}
                      autoFocus
                    />
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        <div className={styles.actions}>
          <Button fullWidth variant="primary" onClick={handleSaveAll}>
            Сохранить изменения
          </Button>
        </div>
      </div>
    </div>
  );
};
