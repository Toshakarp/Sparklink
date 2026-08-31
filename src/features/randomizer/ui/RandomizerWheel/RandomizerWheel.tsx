import type { FC } from 'react';
import { Card } from '@/shared/ui';
import { useRandomizer } from '../../model/useRandomizer';
import type { RandomizerWheelProps } from '../../model/types';
import { getBudgetTier } from '@/entities/place';
import { RandomizerIdle } from '../RandomizerIdle/RandomizerIdle';
import { RandomizerRolling } from '../RandomizerRolling/RandomizerRolling';
import { RandomizerResult } from '../RandomizerResult/RandomizerResult';
import styles from './RandomizerWheel.module.scss';

export const RandomizerWheel: FC<RandomizerWheelProps> = ({
  ideas,
  budgetTiers = [],
  onSelectIdea,
  onOpenDetails,
}) => {
  const { selectedIdea, isRolling, handleRoll } = useRandomizer({
    ideas,
    onSelectIdea,
  });

  const budgetTier = selectedIdea?.budgetId
    ? getBudgetTier(selectedIdea.budgetId, budgetTiers)
    : undefined;

  const cardModeClass = selectedIdea
    ? styles.resultMode
    : styles.idleMode;

  return (
    <Card
      className={`${styles.card} ${cardModeClass} ${
        isRolling ? styles.rollingMode : ''
      }`}
    >
      {isRolling && <RandomizerRolling />}

      {!isRolling && !selectedIdea && (
        <RandomizerIdle
          onRoll={handleRoll}
          disabled={ideas.length === 0}
        />
      )}

      {!isRolling && selectedIdea && (
        <RandomizerResult
          idea={selectedIdea}
          budgetTier={budgetTier}
          onRollAgain={handleRoll}
          onOpenDetails={onOpenDetails}
        />
      )}
    </Card>
  );
};
