import type { FC } from 'react';
import { SettingsSubViewHeader } from './SettingsSubViewHeader';
import { useUserStore } from '@/entities/user';
import styles from './AppearanceManagerView.module.scss';

const THEME_COLORS = [
  { value: '#FF4B4B', name: 'Красный' },
  { value: '#FF8B3E', name: 'Оранж' },
  { value: '#FFB800', name: 'Желтый' },
  { value: '#00C853', name: 'Зеленый' },
  { value: '#00B0FF', name: 'Голубой' },
  { value: '#651FFF', name: 'Лиловый' },
  { value: '#AA00FF', name: 'Пурпур' },
  { value: '#F50057', name: 'Розовый' },
];

export interface AppearanceManagerViewProps {
  onBack: () => void;
}

export const AppearanceManagerView: FC<AppearanceManagerViewProps> = ({
  onBack,
}) => {
  const { currentUser, updateThemeColor } = useUserStore();
  const appearance = currentUser?.themeColor || '#FF4B4B';

  return (
    <div className={styles.container}>
      <SettingsSubViewHeader title="Внешний вид" onBack={onBack} />
      
      <div className={styles.section}>
        <div className={styles.card}>
          <div className={styles.colorsRow}>
            {THEME_COLORS.map((color) => (
              <button
                key={color.value}
                type="button"
                className={styles.colorBtn}
                onClick={() => updateThemeColor(color.value)}
              >
                <div 
                  className={`${styles.colorDot} ${appearance === color.value ? styles.activeColor : ''}`}
                  style={{ backgroundColor: color.value }}
                />
                <span className={styles.colorName}>{color.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
