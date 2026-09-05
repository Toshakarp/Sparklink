import type { UseRandomizerOptions, UseRandomizerReturn } from './types';
import type { PlaceDTO } from '@/shared/api/types/models';
import { useState, useCallback } from 'react';
import { tgService } from '@/shared/lib/telegram/telegram';

export const useRandomizer = ({
  ideas,
  onSelectIdea,
  rollDurationMs = 450,
}: UseRandomizerOptions): UseRandomizerReturn => {
  const [selectedIdea, setSelectedIdea] = useState<PlaceDTO | null>(null);
  const [isRolling, setIsRolling] = useState(false);

  const handleRoll = useCallback(() => {
    if (ideas.length === 0 || isRolling) return;

    setIsRolling(true);
    tgService.haptic('medium');

    setTimeout(() => {
      const availableIdeas =
        ideas.length > 1
          ? ideas.filter((i) => i.id !== selectedIdea?.id)
          : ideas;
      const randomIdx = Math.floor(Math.random() * availableIdeas.length);
      const chosen = availableIdeas[randomIdx] || ideas[0];

      setSelectedIdea(chosen);
      setIsRolling(false);
      tgService.haptic('success');

      if (onSelectIdea && chosen) {
        onSelectIdea(chosen);
      }
    }, rollDurationMs);
  }, [ideas, isRolling, selectedIdea, onSelectIdea, rollDurationMs]);

  return {
    selectedIdea,
    isRolling,
    handleRoll,
    setSelectedIdea,
  };
};
