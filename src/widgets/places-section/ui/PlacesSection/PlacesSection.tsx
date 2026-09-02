import type { FC } from 'react';
import { PlaceCard, usePlaceStore } from '@/entities/place';
import { CategoryFilterModal } from '@/features/place-management';
import { Button } from '@/shared/ui';
import type { PlaceDTO } from '@/shared/api';
import { usePlacesFilter } from '../../model/usePlacesFilter';
import { PlacesSectionHeader } from '../PlacesSectionHeader/PlacesSectionHeader';
import { getBudgetTier } from '@/entities/place';
import { PlacesEmptyState } from '../PlacesEmptyState/PlacesEmptyState';
import styles from './PlacesSection.module.scss';

export interface PlacesSectionProps {
  onOpenDetails: (place: PlaceDTO) => void;
  onOpenAddModal: () => void;
}

export const PlacesSection: FC<PlacesSectionProps> = ({
  onOpenDetails,
  onOpenAddModal,
}) => {
  const places = usePlaceStore((state) => state.dateIdeas);
  const tags = usePlaceStore((state) => state.dateTags);
  const budgetTiers = usePlaceStore((state) => state.budgetTiers);

  const {
    isFilterModalOpen,
    setIsFilterModalOpen,
    selectedTagIds,
    selectedBudgetIds,
    filteredPlaces,
    hasActiveFilters,
    activeFiltersCount,
    handleApplyFilters,
    handleResetFilters,
    handleToggleTag,
    handleToggleBudget,
  } = usePlacesFilter({ places });

  return (
    <section className={styles.section}>
      <PlacesSectionHeader
        count={filteredPlaces.length}
        hasActiveFilters={hasActiveFilters}
        onOpenFilter={() => setIsFilterModalOpen(true)}
        onOpenAddModal={onOpenAddModal}
      />

      {hasActiveFilters && (
        <div className={styles.activeFiltersBar}>
          <span className={styles.filterSummaryText}>
            Фильтры: {activeFiltersCount} активн.
          </span>
          <Button
            type="button"
            variant="ghost"
            className={styles.clearFiltersBtn}
            onClick={handleResetFilters}
          >
            Сбросить
          </Button>
        </div>
      )}


      <div className={styles.content}>
        {filteredPlaces.length === 0 ? (
          <PlacesEmptyState
            hasActiveFilters={hasActiveFilters}
            onResetFilters={handleResetFilters}
            onOpenAddModal={onOpenAddModal}
          />
        ) : (
          <div className={styles.grid}>
            {filteredPlaces.map((place) => {
              const budgetTier = getBudgetTier(place.budgetId, budgetTiers);
              const placeTags = tags.filter((t) => place.tagIds?.includes(t.id));
              return (
                <PlaceCard
                  key={place.id}
                  place={place}
                  budgetTier={budgetTier}
                  tags={placeTags}
                  onClick={() => onOpenDetails(place)}
                />
              );
            })}
          </div>
        )}
      </div>

      <CategoryFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        tags={tags}
        budgetTiers={budgetTiers}
        selectedTagIds={selectedTagIds}
        selectedBudgetIds={selectedBudgetIds}
        onToggleTag={handleToggleTag}
        onToggleBudget={handleToggleBudget}
        onApply={handleApplyFilters}
        onResetFilters={handleResetFilters}
      />
    </section>
  );
};
