import React from 'react';
import styles from './Avatar.module.scss';

export interface AvatarProps {
  src?: string;
  name?: string;
  size?: 'small' | 'medium' | 'large' | 'huge';
  color?: string;
  partnerColor?: string;
  isPartner?: boolean;
  className?: string;
  glow?: boolean;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name = 'U',
  size = 'medium',
  color,
  partnerColor,
  isPartner = false,
  className = '',
  glow = false,
}) => {
  const initials = name.trim().charAt(0).toUpperCase();
  const effectiveColor = color || partnerColor;

  const customStyle: React.CSSProperties = effectiveColor
    ? ({ '--avatar-color': effectiveColor, '--partner-color': effectiveColor } as React.CSSProperties)
    : {};

  const avatarClasses = [
    styles.avatar,
    styles[size],
    isPartner ? styles.partner : '',
    effectiveColor ? styles.colored : '',
    glow ? styles.glow : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={avatarClasses} style={customStyle}>
      {src ? (
        <img src={src} alt={name} className={styles.image} />
      ) : (
        <span className={styles.initials}>{initials}</span>
      )}
    </div>
  );
};
