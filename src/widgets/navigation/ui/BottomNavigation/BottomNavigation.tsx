import type { FC } from 'react';
import { Heart, Calendar, Settings } from 'lucide-react';
import { tgService } from '@/shared/lib/telegram/telegram';
import styles from './BottomNavigation.module.scss';

export type NavigationTab = 'main' | 'dates' | 'settings';

export interface BottomNavigationProps {
  activeTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
}

export const BottomNavigation: FC<BottomNavigationProps> = ({
  activeTab,
  onTabChange,
}) => {
  const handleTab = (tab: NavigationTab) => {
    if (tab !== activeTab) {
      tgService.haptic('light');
      onTabChange(tab);
    }
  };

  return (
    <nav className={styles.tabBar}>
      <button
        onClick={() => handleTab('main')}
        aria-pressed={activeTab === 'main'}
        className={`${styles.tabButton} ${activeTab === 'main' ? styles.active : ''}`}
      >
        <div className={styles.iconWrapper}>
          <Heart size={20} fill={activeTab === 'main' ? 'currentColor' : 'none'} color="currentColor" />
        </div>
        <span className={styles.label}>Главная</span>
      </button>

      <button
        onClick={() => handleTab('dates')}
        aria-pressed={activeTab === 'dates'}
        className={`${styles.tabButton} ${activeTab === 'dates' ? styles.active : ''}`}
      >
        <div className={styles.iconWrapper}>
          <Calendar size={20} fill={activeTab === 'dates' ? 'currentColor' : 'none'} color="currentColor" />
        </div>
        <span className={styles.label}>Свидания</span>
      </button>

      <button
        onClick={() => handleTab('settings')}
        aria-pressed={activeTab === 'settings'}
        className={`${styles.tabButton} ${activeTab === 'settings' ? styles.active : ''}`}
      >
        <div className={styles.iconWrapper}>
          <Settings size={20} fill={activeTab === 'settings' ? 'currentColor' : 'none'} color="currentColor" />
        </div>
        <span className={styles.label}>Настройки</span>
      </button>
    </nav>
  );
};
