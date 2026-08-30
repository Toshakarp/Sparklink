import type { PlaceDTO, BudgetTierDTO } from '@/shared/api/mock';

export interface RandomizerWheelProps {
  ideas: PlaceDTO[];
  budgetTiers?: BudgetTierDTO[];
  onSelectIdea?: (idea: PlaceDTO) => void;
  onOpenDetails?: (idea: PlaceDTO) => void;
}

export interface UseRandomizerOptions {
  ideas: PlaceDTO[];
  onSelectIdea?: (idea: PlaceDTO) => void;
  rollDurationMs?: number;
}

export interface UseRandomizerReturn {
  selectedIdea: PlaceDTO | null;
  isRolling: boolean;
  handleRoll: () => void;
  setSelectedIdea: (idea: PlaceDTO | null) => void;
}
