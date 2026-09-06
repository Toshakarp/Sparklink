import { useState } from 'react';
import type { PlaceDTO } from '@/shared/api/types/models';
import { usePlaceStore } from '@/entities/place';
import { useApi } from '@/app/providers/ApiProvider';

export const usePlacesManager = () => {
  const {
    dateIdeas: places,
    dateTags: tags,
    budgetTiers,
    updatePlace,
    deletePlace,
    addPlace,
  } = usePlaceStore();
  const { placesApi } = useApi();
  const [editingPlace, setEditingPlace] = useState<PlaceDTO | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleDeletePlace = (id: string) => {
    const originalPlace = places.find((p) => p.id === id);
    deletePlace(id);
    if (placesApi) {
      placesApi.deletePlace(id).catch((e) => {
        console.error('Failed to delete place from DB', e);
        if (originalPlace) {
          addPlace(originalPlace);
        }
      });
    }
  };

  return {
    places,
    tags,
    budgetTiers,
    editingPlace,
    setEditingPlace,
    isAddModalOpen,
    setIsAddModalOpen,
    updatePlace,
    handleDeletePlace,
  };
};
