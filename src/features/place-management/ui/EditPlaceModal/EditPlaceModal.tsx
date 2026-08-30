import type { FC } from 'react';
import { Modal } from '@/shared/ui';
import { PlaceForm, type PlaceFormData } from '../PlaceForm/PlaceForm';
import type { PlaceDTO, TagDTO, BudgetTierDTO } from '@/shared/api/mock';

export interface EditPlaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  place: PlaceDTO | null;
  dateTags?: TagDTO[];
  budgetTiers?: BudgetTierDTO[];
  onSavePlace: (place: PlaceDTO) => void;
  onDeletePlace: (id: string) => void;
}

export const EditPlaceModal: FC<EditPlaceModalProps> = ({
  isOpen,
  onClose,
  place,
  dateTags = [],
  budgetTiers = [],
  onSavePlace,
  onDeletePlace,
}) => {
  if (!place) return null;

  const initialData: PlaceFormData = {
    title: place.title,
    emoji: place.emoji || '☕️',
    address: place.address,
    description: place.description,
    tagIds: place.tagIds || [],
    budgetId: place.budgetId,
  };

  const handleFormSubmit = (data: PlaceFormData) => {
    onSavePlace({
      ...place,
      title: data.title,
      emoji: data.emoji,
      address: data.address,
      description: data.description,
      budgetId: data.budgetId,
      tagIds: data.tagIds || [],
    });
    onClose();
  };

  const handleDelete = () => {
    onDeletePlace(place.id);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Редактировать место">
      <PlaceForm
        initialData={initialData}
        dateTags={dateTags}
        budgetTiers={budgetTiers}
        submitLabel="Сохранить изменения"
        onSubmit={handleFormSubmit}
        onCancel={onClose}
        onDelete={handleDelete}
        deleteLabel="Удалить место"
      />
    </Modal>
  );
};
