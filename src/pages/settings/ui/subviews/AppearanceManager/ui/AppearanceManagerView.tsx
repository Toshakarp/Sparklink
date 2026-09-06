import type { FC } from 'react';
import { SettingsSubViewHeader } from '../../SettingsSubViewHeader';
import { Button } from '@/shared/ui';
import { useAppearanceManager } from '../models/useAppearanceManager';
import styles from './AppearanceManagerView.module.scss';

export interface AppearanceManagerViewProps {
  onBack: () => void;
}

export const AppearanceManagerView: FC<AppearanceManagerViewProps> = ({ onBack }) => {
  const {
    selectedColor,
    setSelectedColor,
    isSaving,
    isChanged,
    handleSave,
    colors,
  } = useAppearanceManager(onBack);

  return (
    <div className={styles.container}>
      <SettingsSubViewHeader title="Внешний вид" onBack={onBack} />
      
      <div className={styles.section}>
        <div className={styles.card}>
          <div className={styles.colorsRow}>
            {colors.map((color) => (
              <button
                key={color.value}
                type="button"
                className={styles.colorBtn}
                onClick={() => setSelectedColor(color.value)}
              >
                <div 
                  className={`${styles.colorDot} ${selectedColor === color.value ? styles.activeColor : ''}`}
                  style={{ backgroundColor: color.value }}
                />
                <span className={styles.colorName}>{color.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.saveAction}>
        <Button
          fullWidth
          variant="primary"
          onClick={handleSave}
          disabled={!isChanged || isSaving}
        >
          {isSaving ? 'Сохранение...' : 'Сохранить изменения'}
        </Button>
      </div>
    </div>
  );
};
