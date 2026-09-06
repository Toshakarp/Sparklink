import { useCallback } from 'react';
import { useApi } from '@/app/providers/ApiProvider';
import { useUserStore } from '@/entities/user';
import { usePairStore } from '@/entities/pair';
import { usePlaceStore } from '@/entities/place';
import { useWishTagsStore } from '@/entities/mood';

export const useSyncAll = () => {
  const { placesApi, pairApi } = useApi();
  const currentUser = useUserStore((state) => state.currentUser);

  const syncAll = useCallback(async () => {
    if (!currentUser?.pairId || !currentUser?.id || !pairApi || !placesApi) return;
    const pairId = currentUser.pairId;
    const userId = currentUser.id;

    try {
      const [partner, places, data, selectedTags] = await Promise.all([
        pairApi.getPartner(pairId, userId),
        placesApi.getPlaces(pairId),
        pairApi.getPairData(pairId),
        pairApi.getSelectedMoodTags(pairId),
      ]);

      usePairStore.getState().setPartnerUser(partner);
      usePlaceStore.getState().setPlacesData(places, data.placeCategories, data.budgetTiers);
      useWishTagsStore.getState().setTags(data.moodTags);

      const myIds = selectedTags.filter((t) => t.userId === userId).map((t) => t.tagId);
      const partnerIds = selectedTags.filter((t) => t.userId !== userId).map((t) => t.tagId);
      useWishTagsStore.getState().setSelectedTags(myIds, partnerIds);

      usePairStore.setState({ lastSyncedAt: new Date().toISOString() });
    } catch (err) {
      console.error('[Sync] Data Sync Error:', err);
    }
  }, [currentUser, pairApi, placesApi]);

  return { syncAll };
};
