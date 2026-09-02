import type { FC } from 'react';
import { Sparkles } from 'lucide-react';
import { Button } from '@/shared/ui';
import styles from '../RandomizerWheel/RandomizerWheel.module.scss';

export interface RandomizerIdleProps {
  onRoll: () => void;
  disabled?: boolean;
}

export const RandomizerIdle: FC<RandomizerIdleProps> = ({ onRoll, disabled = false }) => {
  return (
    <div className={styles.stateWrapper}>
      <div className={styles.idleEmoji}>🎲</div>
      <h3 className={styles.idleTitle}>Не знаете, куда сходить?</h3>
      <p className={styles.idleSubtitle}>
        Нажмите кнопку, и мы случайно подберём классную идею для свидания из вашего списка.
      </p>
      <Button
        type="button"
        variant="primary"
        onClick={onRoll}
        disabled={disabled}
        icon={<Sparkles size={16} />}
        className={styles.actionBtn}
      >
        Выбрать случайно
      </Button>
    </div>
  );
};
