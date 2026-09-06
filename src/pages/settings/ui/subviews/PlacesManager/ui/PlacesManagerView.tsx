import type { FC } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { SettingsSubViewHeader } from '../../SettingsSubViewHeader';
import { AddPlaceModal, EditPlaceModal } from '@/features/place-management';
import { Card, Button, IconButton } from '@/shared/ui';
import { usePlacesManager } from '../models/usePlacesManager';
import styles from './PlacesManagerView.module.scss';

export interface PlacesManagerViewProps {
  onBack: () => void;
}

export const PlacesManagerView: FC<PlacesManagerViewProps> = ({ onBack }) => {
  const {
    places,
    tags,
    budgetTiers,
    editingPlace,
    setEditingPlace,
    isAddModalOpen,
    setIsAddModalOpen,
    updatePlace,
    handleDeletePlace,
  } = usePlacesManager();

  return (
    <div className={styles.container}>
      <SettingsSubViewHeader
        title="Список мест и идей"
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
      <div className={styles.list}>
        {places.map((place) => (
          <Card key={place.id} className={styles.itemCard}>
            <div className={styles.itemLeft}>
              <div className={styles.emojiBox}>{place.emoji || '🍿'}</div>
              <div className={styles.itemInfo}>
                <div className={styles.itemTitle}>{place.title}</div>
                <div className={styles.itemSub}>
                  {place.address ? `📍 ${place.address}` : place.description || 'Свидание'}
                </div>
              </div>
            </div>
            <div className={styles.actionBtns}>
              <IconButton
                variant="ghost"
                size="sm"
                onClick={() => setEditingPlace(place)}
                aria-label="Редактировать"
                title="Редактировать"
                icon={<Pencil size={15} />}
              />
              <IconButton
                variant="danger"
                size="sm"
                onClick={() => handleDeletePlace(place.id)}
                aria-label="Удалить"
                title="Удалить"
                icon={<Trash2 size={15} />}
              />
            </div>
          </Card>
        ))}
      </div>
      <EditPlaceModal
        isOpen={Boolean(editingPlace)}
        onClose={() => setEditingPlace(null)}
        place={editingPlace}
        dateTags={tags}
        budgetTiers={budgetTiers}
        onSavePlace={updatePlace}
        onDeletePlace={handleDeletePlace}
      />
      <AddPlaceModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
};
