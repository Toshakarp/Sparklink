import type { FC } from 'react';
import { Inbox, Plus } from 'lucide-react';
import { Button } from '@/shared/ui';
import styles from '../PlacesSection/PlacesSection.module.scss';

export interface PlacesEmptyStateProps {
  hasActiveFilters: boolean;
  onResetFilters: () => void;
  onOpenAddModal: () => void;
}

export const PlacesEmptyState: FC<PlacesEmptyStateProps> = ({
  hasActiveFilters,
  onResetFilters,
  onOpenAddModal,
}) => {
  return (
    <div className={styles.stateCard}>
      <Inbox size={36} className={styles.emptyIcon} />
      <h3 className={styles.stateTitle}>
        {hasActiveFilters ? 'Ничего не найдено' : 'Список пока пуст'}
      </h3>
      <p className={styles.stateDesc}>
        {hasActiveFilters
          ? 'Попробуйте изменить или сбросить параметры фильтрации.'
          : 'Добавьте ваше первое совместное место или идею для свидания!'}
      </p>
      {hasActiveFilters ? (
        <Button type="button" variant="secondary" onClick={onResetFilters}>
          Сбросить фильтры
        </Button>
      ) : (
        <Button
          type="button"
          variant="primary"
          onClick={onOpenAddModal}
          icon={<Plus size={16} />}
        >
          Добавить место
        </Button>
      )}
    </div>
  );
};
