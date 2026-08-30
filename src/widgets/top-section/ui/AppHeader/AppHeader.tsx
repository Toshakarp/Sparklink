import React from 'react';
import { PairAvatarGroup } from '@/entities/pair';
import type { UserDTO } from '@/shared/api/mock';
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
  lastSyncedAt = '18:29',
  onSyncClick,
}) => {
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
          Синхр. {lastSyncedAt}
        </div>
      </div>
    </header>
  );
};
