export interface Place {
  id: string;
  pairId?: string;
  title: string;
  emoji?: string;
  address?: string;
  description?: string;
  clickCount: number;
  lastClickedAt: string | null;
  categoryIds?: string[];
  budgetId?: string;
}

export interface CreatePlacePayload {
  title: string;
  emoji: string;
  address?: string;
  description?: string;
  categoryIds: string[];
  budgetId?: string;
}

export interface BudgetTier {
  id: string;
  pairId?: string | null;
  label: string;
}
