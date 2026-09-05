import type { FC } from 'react';
import { Tag } from '../Tag/Tag';
import type { TagDTO, DateCategoryDTO } from '@/shared/api/types/models';
import styles from './TagList.module.scss';

export interface TagListProps {
  tags: (TagDTO | DateCategoryDTO)[];
  className?: string;
  onTagClick?: (tag: TagDTO | DateCategoryDTO) => void;
  activeTagId?: string;
}

export const TagList: FC<TagListProps> = ({ tags, className = '', onTagClick, activeTagId }) => {
  if (!tags || tags.length === 0) return null;

  return (
    <div className={`${styles.tagList} ${className}`}>
      {tags.map((tag) => (
        <Tag
          key={tag.id}
          emoji={tag.emoji}
          label={tag.label}
          isActive={activeTagId === tag.id}
          onClick={onTagClick ? () => onTagClick(tag) : undefined}
        />
      ))}
    </div>
  );
};
