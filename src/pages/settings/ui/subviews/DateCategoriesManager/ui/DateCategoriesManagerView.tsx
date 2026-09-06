import type { FC } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { SettingsSubViewHeader } from '../../SettingsSubViewHeader';
import { Card, Modal, Button, IconButton } from '@/shared/ui';
import { DateCategoryForm } from './DateCategoryForm';
import { useDateCategoriesManager } from '../models/useDateCategoriesManager';
import styles from './DateCategoriesManagerView.module.scss';

export interface DateCategoriesManagerViewProps {
  onBack: () => void;
}

export const DateCategoriesManagerView: FC<DateCategoriesManagerViewProps> = ({ onBack }) => {
  const {
    customTags,
    isAddModalOpen,
    setIsAddModalOpen,
    editingTag,
    setEditingTag,
    handleSaveAdd,
    handleSaveEdit,
    handleDelete,
  } = useDateCategoriesManager();

  return (
    <div className={styles.container}>
      <SettingsSubViewHeader
        title="Категории свиданий"
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
        <div className={styles.sectionHeader}>Категории ({customTags.length})</div>
        {customTags.map((tag) => (
          <Card key={tag.id} className={styles.tagItem}>
            <div className={styles.tagLeft}>
              <span className={styles.tagEmoji}>{tag.emoji}</span>
              <span className={styles.tagTitle}>{tag.label}</span>
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
        title="Новая категория"
      >
        <DateCategoryForm
          submitLabel="Создать категорию"
          onSubmit={handleSaveAdd}
          onCancel={() => setIsAddModalOpen(false)}
        />
      </Modal>
      <Modal
        isOpen={Boolean(editingTag)}
        onClose={() => setEditingTag(null)}
        title="Редактировать категорию"
      >
        {editingTag && (
          <DateCategoryForm
            initialData={{
              label: editingTag.label || '',
              emoji: editingTag.emoji || '🍿',
            }}
            submitLabel="Сохранить изменения"
            onSubmit={handleSaveEdit}
            onCancel={() => setEditingTag(null)}
            onDelete={() => handleDelete(editingTag.id)}
            deleteLabel="Удалить категорию"
          />
        )}
      </Modal>
    </div>
  );
};
