import { useState} from 'react';
import type { FC } from 'react';
import { Pencil, Check } from 'lucide-react';
import { SettingsSubViewHeader } from './SettingsSubViewHeader';
import { Card, Input, Button, IconButton } from '@/shared/ui';
import { BudgetTag } from '@/entities/place';
import type { BudgetTierDTO } from '@/shared/api/mock/types';
import { usePlaceStore } from '@/entities/place';
import { tgService } from '@/shared/lib/telegram/telegram';
import styles from './BudgetManagerView.module.scss';

export interface BudgetManagerViewProps {
  onBack: () => void;
}

export const BudgetManagerView: FC<BudgetManagerViewProps> = ({ onBack }) => {
  const budgetTiers = usePlaceStore((state) => state.budgetTiers);
  const updateBudgetTier = usePlaceStore((state) => state.updateBudgetTier);

  const [localTiers, setLocalTiers] = useState<BudgetTierDTO[]>(() =>
    budgetTiers.filter((t) => t.id !== 'all'));
  
  const [editingTierId, setEditingTierId] = useState<string | null>(null);

  const handleRangeChange = (id: string, newRange: string) => {
    setLocalTiers((prev) =>
      prev.map((tier) => (tier.id === id ? { ...tier, rangeLabel: newRange } : tier))
    );
  };

  const handleSaveAll = () => {
    localTiers.forEach((tier) => {
      updateBudgetTier(tier);
    });
    tgService.haptic('success');
    onBack();
  };

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
                    onClick={() => setEditingTierId(isEditing ? null : tier.id)}
                    aria-label="Изменить диапазон"
                    className={isEditing ? styles.activeEditBtn : ''}
                  >
                    {isEditing ? <Check size={16} /> : <Pencil size={15} />}
                  </IconButton>
                </div>

                {isEditing && (
                  <div className={styles.editRow}>
                    <Input
                      value={tier.rangeLabel || ''}
                      onChange={(e) => handleRangeChange(tier.id, e.target.value)}
                      placeholder="Например: до 1 500 ₽ или 2 000 – 5 000 ₽"
                      autoFocus
                    />
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        <div className={styles.actions}>
          <Button type="button" variant="primary" fullWidth onClick={handleSaveAll}>
            Сохранить изменения
          </Button>
        </div>
      </div>
    </div>
  );
};
