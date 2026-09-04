import type { TagDTO } from '@/shared/api/types/models';
import { useState } from 'react';
import type { FC } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { SettingsSubViewHeader } from './SettingsSubViewHeader';
import { Card, IconButton, Modal } from '@/shared/ui';
import { MoodTagForm, type MoodTagFormData } from './MoodTagForm';
import { useWishTagsStore } from '@/entities/mood';
import styles from './MoodTagsManagerView.module.scss';

export interface MoodTagsManagerViewProps {
  onBack: () => void;
}

export const MoodTagsManagerView: FC<MoodTagsManagerViewProps> = ({ onBack }) => {
  const { moodTags, addMoodTag, updateMoodTag, deleteMoodTag } = useWishTagsStore();
  const [editingTag, setEditingTag] = useState<TagDTO | null>(null);

  const handleAddSubmit = (data: MoodTagFormData) => {
    addMoodTag({
      label: data.label,
      emoji: data.emoji,
      audience: data.category as 'together' | 'alone',
    });
  };

  const handleEditSubmit = (data: MoodTagFormData) => {
    if (!editingTag) return;
    updateMoodTag({
      ...editingTag,
      label: data.label,
      emoji: data.emoji,
      audience: data.category,
    });
    setEditingTag(null);
  };

  return (
    <div className={styles.container}>
      <SettingsSubViewHeader title="Теги настроения" onBack={onBack} />
      <Card className={styles.addFormCard}>
        <div className={styles.cardTitle}>Добавить новый тег</div>
        <MoodTagForm
          submitLabel="Добавить тег"
          onSubmit={handleAddSubmit}
        />
      </Card>
      <div className={styles.listSection}>
        <div className={styles.sectionHeader}>
          Существующие теги ({moodTags.length})
        </div>
        {moodTags.map((tag) => (
          <Card key={tag.id} className={styles.tagItem}>
            <div className={styles.tagLeft}>
              <span className={styles.tagEmoji}>{tag.emoji}</span>
              <span className={styles.tagTitle}>{tag.label}</span>
              <span className={styles.tagBadge}>
                {tag.audience === 'together'
                  ? 'Для двоих'
                  : 'Для одного'}
              </span>
            </div>
            <div className={styles.tagActions}>
              <IconButton
                variant="ghost"
                size="sm"
                onClick={() => setEditingTag(tag)}
                aria-label="Редактировать тег"
                title="Редактировать тег"
                icon={<Pencil size={15} />}
              />
              <IconButton
                variant="danger"
                size="sm"
                onClick={() => deleteMoodTag(tag.id)}
                aria-label="Удалить тег"
                title="Удалить тег"
                icon={<Trash2 size={15} />}
              />
            </div>
          </Card>
        ))}
      </div>

      <Modal
        isOpen={Boolean(editingTag)}
        onClose={() => setEditingTag(null)}
        title="Редактировать тег настроения"
      >
        {editingTag && (
          <MoodTagForm
            initialData={{
              label: editingTag.label || '',
              emoji: editingTag.emoji || '✨',
              category: editingTag.audience || 'together',
            }}
            submitLabel="Сохранить изменения"
            onSubmit={handleEditSubmit}
            onCancel={() => setEditingTag(null)}
            onDelete={() => {
              deleteMoodTag(editingTag.id);
              setEditingTag(null);
            }}
            deleteLabel="Удалить тег"
          />
        )}
      </Modal>
    </div>
  );
};

