import type { FC } from 'react';
import { Modal } from '@/shared/ui';
import { PlaceForm, type PlaceFormData } from '../PlaceForm/PlaceForm';
import { usePlaceStore } from '@/entities/place';
import { useUserStore } from '@/entities/user';
import { useApi } from '@/app/providers/ApiProvider';

export interface AddPlaceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddPlaceModal: FC<AddPlaceModalProps> = ({
  isOpen,
  onClose,
}) => {
  const onAddPlace = usePlaceStore(state => state.addPlace);
  const replacePlace = usePlaceStore(state => state.replacePlace);
  const deletePlace = usePlaceStore(state => state.deletePlace);
  const dateTags = usePlaceStore(state => state.dateTags);
  const budgetTiers = usePlaceStore(state => state.budgetTiers);
  const currentUser = useUserStore(state => state.currentUser);
  const { placesApi } = useApi();

  const handleFormSubmit = async (data: PlaceFormData) => {
    const tempId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'temp-id';
    onAddPlace({
      id: tempId,
      title: data.title,
      emoji: data.emoji,
      address: data.address,
      description: data.description,
      categoryIds: data.categoryIds || [],
      budgetId: data.budgetId,
    });
    
    onClose();

    if (currentUser?.pairId && placesApi) {
      try {
        const created = await placesApi.createPlace(currentUser.pairId, {
          title: data.title,
          emoji: data.emoji,
          address: data.address,
          description: data.description,
          categoryIds: data.categoryIds || [],
          budgetId: data.budgetId,
        });
        replacePlace(tempId, created);
      } catch (e) {
        console.error('Failed to save place', e);
        deletePlace(tempId); // rollback on error
      }
    }
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
