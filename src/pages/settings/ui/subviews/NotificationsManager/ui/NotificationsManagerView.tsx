import type { FC } from 'react';
import { ToggleSwitch } from '@/shared/ui';
import { SettingsSubViewHeader } from '../../SettingsSubViewHeader';
import { useNotificationsManager } from '../models/useNotificationsManager';
import styles from './NotificationsManagerView.module.scss';

export interface NotificationsManagerViewProps {
  onBack: () => void;
}

export const NotificationsManagerView: FC<NotificationsManagerViewProps> = ({ onBack }) => {
  const { isEnabled, handleToggle } = useNotificationsManager();

  return (
    <div className={styles.container}>
      <SettingsSubViewHeader title="Уведомления" onBack={onBack} />

      <div className={styles.listCard}>
        <div className={styles.row}>
          <div className={styles.rowText}>
            <span className={styles.rowTitle}>Push-уведомления</span>
            <span className={styles.rowDesc}>
              Получать уведомления, когда партнер обновил статус или фото в LockIt
            </span>
          </div>
          <ToggleSwitch
            checked={isEnabled}
            onChange={handleToggle}
          />
        </div>
      </div>
    </div>
  );
};
