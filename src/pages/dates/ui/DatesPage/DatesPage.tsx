import { useState, useCallback } from 'react';
import type { FC } from 'react';
import { AppHeader } from '@/widgets/top-section';
import { RandomizerWheel } from '@/features/randomizer';
import { PlacesSection } from '@/widgets/places-section';
import { PlaceDetailModal, AddPlaceModal, EditPlaceModal } from '@/features/place-management';
import { useUserStore } from '@/entities/user';
import { usePairStore } from '@/entities/pair';
import { usePlaceStore } from '@/entities/place';
import type { PlaceDTO } from '@/shared/api';
import styles from './DatesPage.module.scss';

export const DatesPage: FC = () => {
  const currentUser = useUserStore(state => state.currentUser);
  const partnerUser = usePairStore(state => state.partnerUser);
  const lastSyncedAt = usePairStore(state => state.lastSyncedAt);
  
  const places = usePlaceStore(state => state.dateIdeas);
  const tags = usePlaceStore(state => state.dateTags);
  const budgetTiers = usePlaceStore(state => state.budgetTiers);
  const updatePlace = usePlaceStore(state => state.updatePlace);
  const deletePlace = usePlaceStore(state => state.deletePlace);

  const [isAddPlaceModalOpen, setIsAddPlaceModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedPlaceForDetail, setSelectedPlaceForDetail] = useState<PlaceDTO | null>(null);
  const [editingPlace, setEditingPlace] = useState<PlaceDTO | null>(null);

  const handleCardClick = useCallback((place: PlaceDTO) => {
    setSelectedPlaceForDetail(place);
    setIsDetailModalOpen(true);
  }, []);

  const handleOpenEdit = useCallback((place: PlaceDTO) => {
    setEditingPlace(place);
  }, []);

  if (!currentUser || !partnerUser) return null;

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <AppHeader
          currentUser={currentUser}
          partnerUser={partnerUser}
          lastSyncedAt={lastSyncedAt}
        />

        <RandomizerWheel
          ideas={places}
          budgetTiers={budgetTiers}
          onOpenDetails={handleCardClick}
        />

        <PlacesSection
          onOpenAddModal={() => setIsAddPlaceModalOpen(true)}
          onOpenDetails={handleCardClick}
        />
      </div>

      <PlaceDetailModal
        isOpen={isDetailModalOpen}
        place={selectedPlaceForDetail}
        onClose={() => setIsDetailModalOpen(false)}
        onEdit={handleOpenEdit}
      />

      <EditPlaceModal
        isOpen={Boolean(editingPlace)}
        place={editingPlace}
        dateTags={tags}
        budgetTiers={budgetTiers}
        onClose={() => setEditingPlace(null)}
        onSavePlace={updatePlace}
        onDeletePlace={deletePlace}
      />

      <AddPlaceModal
        isOpen={isAddPlaceModalOpen}
        onClose={() => setIsAddPlaceModalOpen(false)}
      />
    </div>
  );
};

