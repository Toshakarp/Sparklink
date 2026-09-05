import type { UserDTO } from '@/shared/api/types/models';
import React from 'react';
import { Avatar } from '@/shared/ui';

export interface UserAvatarProps {
  user: UserDTO;
  size?: 'small' | 'medium' | 'large' | 'huge';
  isPartner?: boolean;
  glow?: boolean;
  className?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  user,
  size = 'medium',
  isPartner = false,
  glow = false,
  className = '',
}) => {
  return (
    <Avatar
      src={user.photoUrl || undefined}
      name={user.firstName}
      size={size}
      color={user.themeColor}
      partnerColor={user.themeColor}
      isPartner={isPartner}
      glow={glow}
      className={className}
    />
  );
};
