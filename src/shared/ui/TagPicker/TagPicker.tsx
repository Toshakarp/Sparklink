import type { FC } from 'react';
import { Tag } from '../Tag/Tag';
import type { TagDTO } from '../../api/mock/types';

export interface TagPickerProps {
  tags: TagDTO[];
  selectedTagIds: string[];
  onToggleTag?: (id: string) => void;
  readOnly?: boolean;
}

export const TagPicker: FC<TagPickerProps> = ({ tags, selectedTagIds, onToggleTag, readOnly }) => {
  const filteredTags = tags.filter((t) => t.id !== 'all');
  if (filteredTags.length === 0) return null;
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
      {filteredTags.map((tag) => {
        const isSelected = selectedTagIds.includes(tag.id);
        return (
          <Tag
            key={tag.id}
            title={tag.label}
            emoji={tag.emoji}
            isActive={isSelected}
            onClick={readOnly || !onToggleTag ? undefined : () => onToggleTag(tag.id)}
          />
        );
      })}
    </div>
  );
};
