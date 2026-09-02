import type { FC } from 'react';
import { useUserStore } from '@/entities/user';
import { ToggleSwitch } from '@/shared/ui';
import { SettingsSubViewHeader } from './SettingsSubViewHeader';
import styles from './NotificationsManagerView.module.scss';

export interface NotificationsManagerViewProps {
  onBack: () => void;
}

export const NotificationsManagerView: FC<NotificationsManagerViewProps> = ({ onBack }) => {
  const currentUser = useUserStore(state => state.currentUser);
  const updateNotifications = useUserStore(state => state.updateNotifications);
  const isEnabled = currentUser?.notificationsEnabled ?? true;

  return (
    <div className={styles.view}>
      <SettingsSubViewHeader title="Уведомления" onBack={onBack} />

      <div className={styles.content}>
        <div className={styles.item}>
          <div className={styles.itemInfo}>
            <div className={styles.itemTitle}>Push-уведомления</div>
            <div className={styles.itemDesc}>
              Получать уведомления, когда партнер обновил статус или фото в LockIt
            </div>
          </div>
          <ToggleSwitch
            checked={isEnabled}
            onChange={updateNotifications}
          />
        </div>
      </div>
    </div>
  );
};