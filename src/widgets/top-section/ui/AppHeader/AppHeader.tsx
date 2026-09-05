import type { UserDTO } from '@/shared/api/types/models';
import React from 'react';
import { PairAvatarGroup } from '@/entities/pair';
import styles from './AppHeader.module.scss';

export interface AppHeaderProps {
  currentUser: UserDTO;
  partnerUser: UserDTO;
  lastSyncedAt?: string;
  onSyncClick?: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  currentUser,
  partnerUser,
  lastSyncedAt,
  onSyncClick,
}) => {
  const formatTime = (isoString?: string) => {
    if (!isoString) return '18:29';
    try {
      const date = new Date(isoString);
      if (isNaN(date.getTime())) return isoString;
      return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    } catch {
      return isoString;
    }
  };

  const displayTime = formatTime(lastSyncedAt);

  return (
    <header className={styles.header} onClick={onSyncClick}>
      <PairAvatarGroup 
        currentUser={currentUser} 
        partnerUser={partnerUser} 
        size="small" 
        isSync={false} 
      />
      <div className={styles.infoWrapper}>
        <div className={styles.pairTitle}>
          {currentUser.firstName} & {partnerUser.firstName}
        </div>
        <div className={styles.syncStatus}>
          Синхр. {displayTime}
        </div>
      </div>
    </header>
  );
};
