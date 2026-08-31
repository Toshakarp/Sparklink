import type { FC } from 'react';
import { SettingsSubViewHeader } from './SettingsSubViewHeader';
import { Card, SectionHeader } from '@/shared/ui';
import { useUserStore } from '@/entities/user';
import styles from './AppearanceManagerView.module.scss';

export interface AppearanceManagerViewProps {
  onBack: () => void;
}

const ACCENT_COLORS = [
  { name: 'Циан', value: '#00e5ff' },
  { name: 'Розовый', value: '#ff2d55' },
  { name: 'Фиолетовый', value: '#af52de' },
  { name: 'Оранжевый', value: '#ff9500' },
  { name: 'Зелёный', value: '#34c759' },
  { name: 'Жёлтый', value: '#ffd60a' },
  { name: 'Индиго', value: '#5856d6' },
  { name: 'Красный', value: '#ff3b30' },
];

export const AppearanceManagerView: FC<AppearanceManagerViewProps> = ({
  onBack,
}) => {
  const appearance = useUserStore(state => state.appearance) || { accentColor: '#ff2d55' };
  const onUpdateAppearance = useUserStore(state => state.updateAppearance);

  const selectColor = (color: string) => {
    onUpdateAppearance({
      ...appearance,
      accentColor: color,
    });
    document.documentElement.style.setProperty('--accent-color', color);
  };

  return (
    <div className={styles.container}>
      <SettingsSubViewHeader title="Внешний вид" onBack={onBack} />

      <div className={styles.section}>
        <SectionHeader title="Цветовой акцент" />
        <Card className={styles.card}>
          <div className={styles.colorsRow}>
            {ACCENT_COLORS.map((c) => (
              <button
                key={c.value}
                type="button"
                className={styles.colorBtn}
                onClick={() => selectColor(c.value)}
              >
                <div
                  className={`${styles.colorDot} ${
                    appearance.accentColor === c.value ? styles.activeColor : ''
                  }`}
                  style={{ backgroundColor: c.value }}
                />
                <span className={styles.colorName}>{c.name}</span>
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
