import { useState, useMemo } from 'react';
import type { PlaceDTO } from '@/shared/api';

export interface UsePlacesFilterProps {
  places: PlaceDTO[];
}

export const usePlacesFilter = ({ places }: UsePlacesFilterProps) => {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [selectedBudgetIds, setSelectedBudgetIds] = useState<string[]>([]);

  const filteredPlaces = useMemo(() => {
    return places.filter((place) => {
      if (selectedTagIds.length > 0) {
        const hasMatchingTag = place.tagIds?.some((id) => selectedTagIds.includes(id));
        if (!hasMatchingTag) return false;
      }
      if (selectedBudgetIds.length > 0) {
        if (!place.budgetId || !selectedBudgetIds.includes(place.budgetId)) return false;
      }
      return true;
    });
  }, [places, selectedTagIds, selectedBudgetIds]);

  const hasActiveFilters = selectedTagIds.length > 0 || selectedBudgetIds.length > 0;
  const activeFiltersCount = selectedTagIds.length + selectedBudgetIds.length;

  const handleApplyFilters = (tagIds: string[], budgetIds: string[]) => {
    setSelectedTagIds(tagIds);
    setSelectedBudgetIds(budgetIds);
  };

  const handleResetFilters = () => {
    setSelectedTagIds([]);
    setSelectedBudgetIds([]);
  };

  const handleToggleTag = (tagId: string) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };

  const handleToggleBudget = (budgetId: string) => {
    setSelectedBudgetIds((prev) =>
      prev.includes(budgetId) ? prev.filter((id) => id !== budgetId) : [...prev, budgetId]
    );
  };

  return {
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
  };
};
