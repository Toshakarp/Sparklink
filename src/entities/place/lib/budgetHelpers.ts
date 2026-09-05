import type { BudgetTierDTO } from '@/shared/api/types/models';

export function getBudgetTier(
  idOrBudgetId: string | undefined,
  tiers: BudgetTierDTO[]
): BudgetTierDTO | undefined {
  if (!idOrBudgetId || idOrBudgetId === 'all') return undefined;
  return tiers.find((t) => t.id === idOrBudgetId);
}
