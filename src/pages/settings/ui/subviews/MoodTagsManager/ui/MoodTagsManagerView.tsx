import type { FC } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { SettingsSubViewHeader } from '../../SettingsSubViewHeader';
import { Card, Modal, Button, IconButton } from '@/shared/ui';
import { MoodTagForm } from './MoodTagForm';
import { useMoodTagsManager } from '../models/useMoodTagsManager';
import styles from './MoodTagsManagerView.module.scss';

export interface MoodTagsManagerViewProps {
  onBack: () => void;
}

export const MoodTagsManagerView: FC<MoodTagsManagerViewProps> = ({ onBack }) => {
  const {
    moodTags,
    editingTag,
    setEditingTag,
    isAddModalOpen,
    setIsAddModalOpen,
    handleAddSubmit,
    handleEditSubmit,
    handleDelete,
  } = useMoodTagsManager();

  return (
    <div className={styles.container}>
      <SettingsSubViewHeader
        title="Теги настроения"
        onBack={onBack}
        rightAction={
          <Button
            type="button"
            variant="primary"
            onClick={() => setIsAddModalOpen(true)}
            icon={<Plus size={16} />}
          >
            Добавить
          </Button>
        }
      />

      <div className={styles.listSection}>
        <div className={styles.sectionHeader}>Список тегов ({moodTags.length})</div>

        {moodTags.map((tag) => (
          <Card key={tag.id} className={styles.tagItem}>
            <div className={styles.tagLeft}>
              <span className={styles.tagEmoji}>{tag.emoji}</span>
              <span className={styles.tagTitle}>{tag.label}</span>
              <span className={styles.tagBadge}>
                {tag.audience === 'alone' ? 'Для одного' : 'Для двоих'}
              </span>
            </div>

            <div className={styles.tagActions}>
              <IconButton
                variant="ghost"
                size="sm"
                onClick={() => setEditingTag(tag)}
                aria-label="Редактировать"
                title="Редактировать"
                icon={<Pencil size={15} />}
              />
              <IconButton
                variant="danger"
                size="sm"
                onClick={() => handleDelete(tag.id)}
                aria-label="Удалить"
                title="Удалить"
                icon={<Trash2 size={15} />}
              />
            </div>
          </Card>
        ))}
      </div>

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Новый тег настроения"
      >
        <MoodTagForm
          submitLabel="Создать тег"
          onSubmit={handleAddSubmit}
          onCancel={() => setIsAddModalOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={Boolean(editingTag)}
        onClose={() => setEditingTag(null)}
        title="Редактировать тег"
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
            onDelete={() => handleDelete(editingTag.id)}
            deleteLabel="Удалить тег"
          />
        )}
      </Modal>
    </div>
  );
};
