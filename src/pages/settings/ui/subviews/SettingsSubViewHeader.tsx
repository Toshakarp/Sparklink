import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { IconButton } from '@/shared/ui';
import styles from './SettingsSubViewHeader.module.scss';

export interface SettingsSubViewHeaderProps {
  title: string;
  onBack: () => void;
  rightAction?: React.ReactNode;
}

export const SettingsSubViewHeader: React.FC<SettingsSubViewHeaderProps> = ({
  title,
  onBack,
  rightAction,
}) => {
  return (
    <div className={styles.header}>
      <div className={styles.left}>
        <IconButton variant="ghost" onClick={onBack} aria-label="Назад">
          <ArrowLeft size={20} />
        </IconButton>
        <span className={styles.title}>{title}</span>
      </div>
      {rightAction}
    </div>
  );
};
