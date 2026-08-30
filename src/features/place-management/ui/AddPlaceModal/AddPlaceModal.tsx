import type { FC } from 'react';
import { Modal } from '@/shared/ui';
import { PlaceForm, type PlaceFormData } from '../PlaceForm/PlaceForm';
import { usePlaceStore } from '@/entities/place';

export interface AddPlaceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddPlaceModal: FC<AddPlaceModalProps> = ({
  isOpen,
  onClose,
}) => {
  const onAddPlace = usePlaceStore(state => state.addPlace);
  const dateTags = usePlaceStore(state => state.dateTags);
  const budgetTiers = usePlaceStore(state => state.budgetTiers);

  const handleFormSubmit = (data: PlaceFormData) => {
    onAddPlace({
      title: data.title,
      emoji: data.emoji,
      address: data.address,
      description: data.description,
      tagIds: data.tagIds || [],
      budgetId: data.budgetId,
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Добавить новое место">
      <PlaceForm
        dateTags={dateTags}
        budgetTiers={budgetTiers}
        submitLabel="Добавить место"
        onSubmit={handleFormSubmit}
        onCancel={onClose}
      />
    </Modal>
  );
};
