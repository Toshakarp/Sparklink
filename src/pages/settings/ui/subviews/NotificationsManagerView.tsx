import type { FC } from 'react';
import { SettingsSubViewHeader } from './SettingsSubViewHeader';
import { Card, ToggleSwitch } from '@/shared/ui';
import { NOTIFICATION_ITEMS } from './notifications.config';
import type { NotificationSettingsDTO } from '@/shared/api/mock/types';
import { useUserStore } from '@/entities/user';
import styles from './NotificationsManagerView.module.scss';

export interface NotificationsManagerViewProps {
  onBack: () => void;
}

export const NotificationsManagerView: FC<NotificationsManagerViewProps> = ({
  onBack,
}) => {
  const settings = useUserStore(state => state.notifications) || {
    partnerAttention: true,
    moodUpdates: true,
    newLockItPhotos: true,
    soundAndHaptics: true,
  };
  const onUpdateSettings = useUserStore(state => state.updateNotifications);

  const toggleKey = (key: keyof NotificationSettingsDTO) => {
    onUpdateSettings({
      ...settings,
      [key]: !settings[key],
    });
  };

  return (
    <div className={styles.container}>
      <SettingsSubViewHeader title="Уведомления" onBack={onBack} />

      <Card className={styles.listCard}>
        {NOTIFICATION_ITEMS.map((item) => (
          <div key={item.key} className={styles.row}>
            <div className={styles.rowText}>
              <div className={styles.rowTitle}>{item.title}</div>
              <div className={styles.rowDesc}>{item.description}</div>
            </div>
            <ToggleSwitch
              checked={Boolean(settings[item.key])}
              onChange={() => toggleKey(item.key)}
            />
          </div>
        ))}
      </Card>
    </div>
  );
};
