import type { FC } from 'react';
import { Sparkles } from 'lucide-react';
import styles from '../RandomizerWheel/RandomizerWheel.module.scss';

export const RandomizerRolling: FC = () => {
  return (
    <div className={styles.stateWrapper}>
      <div className={styles.rollingHeader}>
        <Sparkles size={16} className={styles.spinIcon} />
        <span>Выбираем идеальное свидание...</span>
      </div>
      <div className={styles.skeletonRow}>
        <div className={styles.skeletonEmoji} />
        <div className={styles.skeletonTexts}>
          <div className={styles.skeletonLineLong} />
          <div className={styles.skeletonLineShort} />
        </div>
      </div>
    </div>
  );
};
