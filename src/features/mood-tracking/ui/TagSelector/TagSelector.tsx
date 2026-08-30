import React from 'react';
import type { FC } from 'react';
import { MoodTag } from '@/shared/ui';
import type { TagDTO, UserDTO } from '@/shared/api/mock/types';
import styles from './TagSelector.module.scss';

export interface TagSelectorProps {
  tags: TagDTO[];
  currentUser?: UserDTO;
  partnerUser?: UserDTO;
  onToggleTag: (tagId: string) => void;
  className?: string;
}

export const TagSelector: FC<TagSelectorProps> = ({
  tags,
  currentUser,
  partnerUser,
  onToggleTag,
  className = '',
}) => {
  return (
    <div className={`${styles.selectorWrapper} ${className}`.trim()}>
      <div className={styles.tagsGrid}>
        {tags.map((tag) => (
          <MoodTag
            key={tag.id}
            emoji={tag.emoji}
            title={tag.label}
            selectedByMe={Boolean(tag.selectedByMe)}
            selectedByPartner={Boolean(tag.selectedByPartner)}
            myColor={currentUser?.themeColor || '#ff2d55'}
            partnerColor={partnerUser?.themeColor || '#00e5ff'}
            onClick={() => onToggleTag(tag.id)}
          />
        ))}
      </div>
    </div>
  );
};
