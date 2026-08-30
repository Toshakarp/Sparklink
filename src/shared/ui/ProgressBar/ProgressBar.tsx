import React, { useRef, useEffect } from 'react';
import type { FC } from 'react';
import styles from './ProgressBar.module.scss';

export interface ProgressBarProps {
  progress: number; // 0 to 100
  color?: string;
  height?: number | string;
  className?: string;
}

export const ProgressBar: FC<ProgressBarProps> = ({
  progress,
  color,
  height = 4,
  className = '',
}) => {
  const clamped = Math.max(0, Math.min(100, progress));
  const trackRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (trackRef.current) {
      const heightVal = typeof height === 'number' ? `${height}px` : height;
      trackRef.current.style.setProperty('--progress-height', heightVal);
    }
    if (fillRef.current) {
      fillRef.current.style.setProperty('--progress-width', `${clamped}%`);
      if (color) {
        fillRef.current.style.setProperty('--progress-color', color);
      }
    }
  }, [clamped, height, color]);

  return (
    <div
      ref={trackRef}
      className={`${styles.progressBarTrack} ${className}`.trim()}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div ref={fillRef} className={styles.progressBarFill} />
    </div>
  );
};
