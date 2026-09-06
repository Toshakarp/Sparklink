import { useState } from 'react';
import type { BudgetTierDTO } from '@/shared/api/types/models';
import { usePlaceStore } from '@/entities/place';
import { useApi } from '@/app/providers/ApiProvider';
import { tgService } from '@/shared/lib/telegram/telegram';

export const useBudgetManager = (onBack: () => void) => {
  const budgetTiers = usePlaceStore((state) => state.budgetTiers);
  const updateBudgetTier = usePlaceStore((state) => state.updateBudgetTier);
  const setBudgetTiers = usePlaceStore((state) => state.setBudgetTiers);
  const { pairApi } = useApi();

  const [localTiers, setLocalTiers] = useState<BudgetTierDTO[]>(() =>
    budgetTiers.filter((t) => t.id !== 'all')
  );
  
  const [editingTierId, setEditingTierId] = useState<string | null>(null);

  const handleRangeChange = (id: string, newRange: string) => {
    setLocalTiers((prev) =>
      prev.map((tier) => (tier.id === id ? { ...tier, rangeLabel: newRange } : tier))
    );
  };

  const handleToggleEdit = (id: string) => {
    setEditingTierId((prev) => (prev === id ? null : id));
  };

  const handleSaveAll = async () => {
    const originalTiers = [...budgetTiers];
    localTiers.forEach((tier) => {
      updateBudgetTier(tier);
    });
    tgService.haptic('success');
    onBack();

    if (pairApi) {
      try {
        await Promise.all(localTiers.map((tier) => pairApi.updateBudgetTier(tier)));
      } catch (err) {
        console.error('Failed to update budget tiers in DB', err);
        setBudgetTiers(originalTiers); // rollback on error
      }
    }
  };

  return {
    localTiers,
    editingTierId,
    handleRangeChange,
    handleToggleEdit,
    handleSaveAll,
  };
};
