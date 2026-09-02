import type { FC } from 'react';
import { useUserStore } from '@/entities/user';
import { SettingsSubViewHeader } from './SettingsSubViewHeader';
import styles from './AppearanceManagerView.module.scss';

const PRESET_COLORS = [
  { label: 'Розовый (по умолчанию)', value: '#ff2d55' },
  { label: 'Лавандовый', value: '#af52de' },
  { label: 'Индиго', value: '#5856d6' },
  { label: 'Мятный', value: '#34c759' },
  { label: 'Персиковый', value: '#ff9500' },
  { label: 'Небесный', value: '#007aff' },
];

export interface AppearanceManagerViewProps {
  onBack: () => void;
}

export const AppearanceManagerView: FC<AppearanceManagerViewProps> = ({ onBack }) => {
  const currentUser = useUserStore(state => state.currentUser);
  const updateThemeColor = useUserStore(state => state.updateThemeColor);
  const currentColor = currentUser?.themeColor || '#ff2d55';

  return (
    <div className={styles.view}>
      <SettingsSubViewHeader title="Оформление" onBack={onBack} />

      <div className={styles.content}>
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Цветовой акцент приложения</div>
          <div className={styles.colorGrid}>
            {PRESET_COLORS.map(c => {
              const isSelected = currentColor === c.value;
              return (
                <button
                  key={c.value}
                  type="button"
                  className={`${styles.colorItem} ${isSelected ? styles.active : ''}`}
                  onClick={() => updateThemeColor(c.value)}
                >
                  <span className={styles.circle} style={{ backgroundColor: c.value }} />
                  <span className={styles.label}>{c.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};