import type { FC, CSSProperties } from 'react';
import { Tag, type TagProps } from '@/shared/ui/Tag/Tag';
import styles from './MoodTag.module.scss';

export interface MoodTagProps extends Omit<TagProps, 'isActive'> {
  selectedByMe?: boolean;
  selectedByPartner?: boolean;
  myColor?: string;
  partnerColor?: string;
}

export const MoodTag: FC<MoodTagProps> = ({
  selectedByMe = false,
  selectedByPartner = false,
  myColor = 'var(--my-color, #ff2d55)',
  partnerColor = '#00e5ff',
  className = '',
  style,
  ...props
}) => {
  const isBothSelected = selectedByMe && selectedByPartner;

  const customStyle: CSSProperties = {
    '--my-color': myColor,
    '--partner-color': partnerColor,
    ...style,
  } as CSSProperties;

  const classes = [
    styles.moodTag,
    isBothSelected ? styles.bothSelected : '',
    selectedByMe && !isBothSelected ? styles.mySelected : '',
    selectedByPartner && !isBothSelected ? styles.partnerSelected : '',
    className,
  ].filter(Boolean).join(' ');

  const partnerDot = (selectedByPartner && !isBothSelected) 
    ? <span className={styles.partnerDot} /> 
    : null;

  return (
    <Tag
      className={classes}
      style={customStyle}
      addonRight={partnerDot}
      {...props}
    />
  );
};