import type { UserDTO, TagDTO } from '@/shared/api/types/models';
import type { FC } from 'react';
import { MoodTag } from '@/shared/ui';
import styles from './TagSelector.module.scss';

export interface TagSelectorProps {
  tags: TagDTO[];
  currentUser?: UserDTO;
  partnerUser?: UserDTO;
  mySelectedTagIds?: string[];
  partnerSelectedTagIds?: string[];
  onToggleTag: (tagId: string) => void;
  className?: string;
}

export const TagSelector: FC<TagSelectorProps> = ({
  tags,
  currentUser,
  partnerUser,
  mySelectedTagIds = [],
  partnerSelectedTagIds = [],
  onToggleTag,
  className = '',
}) => {
  return (
    <div className={`${styles.selectorWrapper} ${className}`.trim()}>
      <div className={styles.tagsGrid}>
        {tags.map((tag) => (
          <MoodTag
            key={tag.id}
            emoji={tag.emoji || ''}
            title={tag.label}
            selectedByMe={mySelectedTagIds.includes(tag.id)}
            selectedByPartner={partnerSelectedTagIds.includes(tag.id)}
            myColor={currentUser?.themeColor || '#ff2d55'}
            partnerColor={partnerUser?.themeColor || '#00e5ff'}
            onClick={() => onToggleTag(tag.id)}
          />
        ))}
      </div>
    </div>
  );
};
