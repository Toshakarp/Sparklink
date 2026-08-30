import React from 'react';
import { Card, ProgressBar } from '@/shared/ui';
import styles from './MoodStatusPill.module.scss';

export interface MoodStatusPillProps {
  label: string;
  emoji: string;
  title: string;
  energyLevel: number;
  color?: string;
  isInteractive?: boolean;
  onClick?: () => void;
  className?: string;
}

export const MoodStatusPill: React.FC<MoodStatusPillProps> = ({
  label,
  emoji,
  title,
  energyLevel,
  color = 'var(--accent-color, #ff2d55)',
  isInteractive = false,
  onClick,
  className = '',
}) => {
  const customStyle: React.CSSProperties = {
    '--pill-color': color,
  } as React.CSSProperties;

  return (
    <Card
      className={`${styles.pillCard} ${isInteractive ? styles.interactive : ''} ${className}`.trim()}
      style={customStyle}
      onClick={isInteractive ? onClick : undefined}
    >
      <div className={styles.inner}>
        <div className={styles.header}>
          <span className={styles.label}>{label}</span>
          <span className={styles.energyVal} style={{ color }}>{energyLevel}%</span>
        </div>

        <div className={styles.moodRow}>
          <span className={styles.emoji}>{emoji}</span>
          <span className={styles.moodTitle}>{title}</span>
        </div>

        <ProgressBar progress={energyLevel} color={color} height={4} />
      </div>
    </Card>
  );
};
