import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Card } from '@/shared/ui';
import styles from './SettingsListItem.module.scss';

export interface SettingsListItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  count?: number;
  onClick: () => void;
  isDestructive?: boolean;
  rightElement?: React.ReactNode;
}

export const SettingsListItem: React.FC<SettingsListItemProps> = ({
  icon,
  title,
  subtitle,
  count,
  onClick,
  isDestructive = false,
  rightElement,
}) => {
  return (
    <Card
      className={`${styles.item} ${isDestructive ? styles.destructive : ''}`}
      onClick={onClick}
      interactive
    >
      <div className={styles.left}>
        <div className={styles.iconBox}>{icon}</div>
        <div className={styles.textGroup}>
          <span className={styles.title}>{title}</span>
          {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
        </div>
      </div>

      <div className={styles.right}>
        {count !== undefined && (
          <div className={styles.countBadge}>
            <span className={styles.countText}>{count}</span>
          </div>
        )}
        {rightElement || <ChevronRight size={18} className={styles.chevron} />}
      </div>
    </Card>
  );
};
