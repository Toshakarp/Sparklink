import type { PlaceDTO, BudgetTierDTO } from '@/shared/api/types/models';
import type { FC } from 'react';
import { Sparkles, RefreshCw, ChevronRight } from 'lucide-react';
import { Button } from '@/shared/ui';
import { BudgetTag } from '@/entities/place';
import styles from '../RandomizerWheel/RandomizerWheel.module.scss';

export interface RandomizerResultProps {
  idea: PlaceDTO;
  budgetTier?: BudgetTierDTO;
  onRollAgain: () => void;
  onOpenDetails?: (idea: PlaceDTO) => void;
}

export const RandomizerResult: FC<RandomizerResultProps> = ({
  idea,
  budgetTier,
  onRollAgain,
  onOpenDetails,
}) => {
  return (
    <div className={styles.stateWrapper}>
      <div className={styles.resultHeader}>
        <div className={styles.resultBadge}>
          <Sparkles size={14} />
          <span>Случайный выбор</span>
        </div>
        {budgetTier && <BudgetTag budgetTier={budgetTier} />}
      </div>

      <div
        className={styles.resultBody}
        onClick={() => onOpenDetails && onOpenDetails(idea)}
        role="button"
        tabIndex={0}
      >
        <div className={styles.resultEmojiBox}>
          {idea.emoji || '🍿'}
        </div>
        <div className={styles.resultInfo}>
          <h4 className={styles.resultTitle}>{idea.title}</h4>
          <p className={styles.resultSubtitle}>
            {idea.address
              ? `📍 ${idea.address}`
              : idea.description || 'Идея для свидания'}
          </p>
        </div>
      </div>

      <div className={styles.btnRow}>
        <Button
          type="button"
          variant="secondary"
          onClick={onRollAgain}
          icon={<RefreshCw size={15} />}
          className={styles.againBtn}
        >
          Ещё вариант
        </Button>
        {onOpenDetails && (
          <Button
            type="button"
            variant="primary"
            onClick={() => onOpenDetails(idea)}
            icon={<ChevronRight size={16} />}
            className={styles.detailsBtn}
          >
            Подробнее
          </Button>
        )}
      </div>
    </div>
  );
};
