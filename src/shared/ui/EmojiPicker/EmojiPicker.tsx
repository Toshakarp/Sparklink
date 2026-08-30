import React from 'react';
import type { FC } from 'react';
import { IconButton } from '../IconButton/IconButton';
import { DEFAULT_EMOJIS } from '@/shared/config';
import styles from './EmojiPicker.module.scss';

export interface EmojiPickerProps {
  selectedEmoji: string;
  onSelectEmoji: (emoji: string) => void;
  initialEmoji?: string;
  emojis?: string[];
  className?: string;
  showPreview?: boolean;
}

export const EmojiPicker: FC<EmojiPickerProps> = ({
  selectedEmoji,
  onSelectEmoji,
  initialEmoji,
  emojis = DEFAULT_EMOJIS,
  className = '',
  showPreview = true,
}) => {
  const allEmojis = React.useMemo(() => {
    const list = [...emojis];
    if (initialEmoji && !list.includes(initialEmoji)) {
      list.unshift(initialEmoji);
    }
    if (selectedEmoji && !list.includes(selectedEmoji)) {
      list.unshift(selectedEmoji);
    }
    return Array.from(new Set(list));
  }, [emojis, initialEmoji, selectedEmoji]);

  const hasOriginal = Boolean(initialEmoji);

  return (
    <div className={`${styles.container} ${className}`.trim()}>
      {showPreview && (
        <div className={styles.previewBar}>
          <div className={styles.previewItem}>
            <span className={styles.previewLabel}>Выбрано:</span>
            <span className={styles.previewEmojiBadge}>{selectedEmoji || '—'}</span>
          </div>

          {hasOriginal && (
            <div className={styles.previewItem}>
              <span className={styles.previewLabel}>Текущее:</span>
              <span className={`${styles.previewEmojiBadge} ${styles.currentBadge}`}>
                {initialEmoji}
              </span>
            </div>
          )}
        </div>
      )}

      <div className={styles.grid}>
        {allEmojis.map((emoji) => {
          const isSelected = selectedEmoji === emoji;
          const isCurrent = hasOriginal && initialEmoji === emoji;

          let btnClass = styles.emojiBtn;
          if (isSelected) {
            btnClass += ` ${styles.selected}`;
          }
          if (isCurrent && !isSelected) {
            btnClass += ` ${styles.current}`;
          }

          return (
            <IconButton
              key={emoji}
              shape="square"
              size="md"
              isActive={isSelected}
              onClick={() => onSelectEmoji(emoji)}
              className={btnClass}
              title={
                isSelected && isCurrent
                  ? `Текущая и выбранная: ${emoji}`
                  : isCurrent
                  ? `Текущая установленная: ${emoji}`
                  : isSelected
                  ? `Выбрано: ${emoji}`
                  : emoji
              }
              aria-label={emoji}
            >
              <span className={styles.emojiText}>{emoji}</span>
            </IconButton>
          );
        })}
      </div>
    </div>
  );
};

