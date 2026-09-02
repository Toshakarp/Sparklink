import type { FC } from 'react';
import { Avatar } from '@/shared/ui';
import type { UserDTO } from '@/shared/api/mock';
import styles from './PairAvatarGroup.module.scss';

export interface PairAvatarGroupProps {
  currentUser: UserDTO;
  partnerUser: UserDTO;
  size?: 'small' | 'medium' | 'large';
  isSync?: boolean;
  className?: string;
}

export const PairAvatarGroup: FC<PairAvatarGroupProps> = ({
  currentUser,
  partnerUser,
  size = 'medium',
  isSync = true,
  className = '',
}) => {
  return (
    <div className={`${styles.avatarGroup} ${className}`.trim()}>
      <div className={styles.avatarItem}>
        <Avatar
          src={currentUser.photoUrl || undefined}
          name={currentUser.firstName}
          color={currentUser.themeColor}
          size={size}
        />
      </div>
      <div className={styles.avatarItem}>
        <Avatar
          src={partnerUser.photoUrl || undefined}
          name={partnerUser.firstName}
          color={partnerUser.themeColor}
          isPartner
          size={size}
        />
      </div>
      {isSync && <div className={styles.syncBadge} />}
    </div>
  );
};

