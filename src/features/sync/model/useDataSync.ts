import { useEffect } from 'react';
import { useApi } from '@/app/providers/ApiProvider';
import { useUserStore } from '@/entities/user';
import { usePairStore } from '@/entities/pair';
import { usePlaceStore } from '@/entities/place';
import { useWishTagsStore } from '@/entities/mood';
import { supabase } from '@/shared/api/supabase/client';
import { SUPABASE_TABLES } from '@/shared/api/supabase/constants/tables';
import { mapUserFromDb } from '@/shared/api/supabase/mappers';
import { useAppInit } from '@/features/auth';

export const useDataSync = () => {
  const { status } = useAppInit();
  const { placesApi, pairApi } = useApi();
  const isAuth = useUserStore((state) => state.isAuth);
  const currentUser = useUserStore((state) => state.currentUser);
  
  // 1. Initial Data Fetching
  useEffect(() => {
    if ((status === 'telegram_ready' || status === 'browser_mock') && isAuth && currentUser?.pairId && pairApi && placesApi) {
      const pairId = currentUser.pairId;
      const userId = currentUser.id;
      
      pairApi.getPartner(pairId, userId).then(p => usePairStore.getState().setPartnerUser(p));
      placesApi.getPlaces(pairId).then(places => {
          pairApi.getPairData(pairId).then(data => {
              usePlaceStore.getState().setPlacesData(places, data.placeCategories, data.budgetTiers);
              useWishTagsStore.getState().setTags(data.moodTags);
          });
      });
      pairApi.getSelectedMoodTags(pairId).then(selectedTags => {
        const myIds = selectedTags.filter(t => t.userId === userId).map(t => t.tagId);
        const partnerIds = selectedTags.filter(t => t.userId !== userId).map(t => t.tagId);
        useWishTagsStore.getState().setSelectedTags(myIds, partnerIds);
      });
    }
  }, [status, isAuth, currentUser?.pairId, currentUser?.id, pairApi, placesApi]);

  // 2. Realtime Synchronization
  useEffect(() => {
    if (status !== 'telegram_ready' || !currentUser?.pairId) return;
    
    const pairId = currentUser.pairId;
    const userId = currentUser.id;

    const channel = supabase.channel(`pair-${pairId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: SUPABASE_TABLES.USER_MOOD_TAGS, filter: `pair_id=eq.${pairId}` },
        (payload) => {
          const { eventType, new: newRecord, old: oldRecord } = payload as any;
          if (eventType === 'INSERT' && newRecord) {
            if (newRecord.user_id !== userId) {
              useWishTagsStore.getState().markPartnerTag(newRecord.tag_id);
            }
          } else if (eventType === 'DELETE' && oldRecord) {
            if (oldRecord.user_id !== userId) {
              const currentPartnerTags = useWishTagsStore.getState().partnerSelectedTagIds;
              useWishTagsStore.getState().setPartnerSelectedTags(
                currentPartnerTags.filter(id => id !== oldRecord.tag_id)
              );
            }
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: SUPABASE_TABLES.USERS, filter: `pair_id=eq.${pairId}` },
        (payload) => {
          // If the changed user is the partner, update the partner store
          const newData = payload.new as any;
          if (newData && newData.id !== userId) {
             const mappedPartner = mapUserFromDb(newData);
             usePairStore.getState().setPartnerUser(mappedPartner);
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: SUPABASE_TABLES.PLACES, filter: `pair_id=eq.${pairId}` },
        () => {
           // When a place is added/updated/deleted, just refetch places
           // This ensures categories and tags are mapped correctly without complex logic
           if (placesApi) {
             placesApi.getPlaces(pairId).then(places => {
               // We only update places, keeping categories and budgets intact
               const currentCategories = usePlaceStore.getState().dateTags;
               const currentBudgets = usePlaceStore.getState().budgetTiers;
               usePlaceStore.getState().setPlacesData(places, currentCategories, currentBudgets);
             });
           }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [status, currentUser?.pairId, currentUser?.id, placesApi]);
  
  return { status };
};
