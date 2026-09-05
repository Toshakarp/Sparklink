import { useEffect } from 'react';
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import { useApi } from '@/app/providers/ApiProvider';
import { useUserStore } from '@/entities/user';
import { usePairStore } from '@/entities/pair';
import { usePlaceStore } from '@/entities/place';
import { useWishTagsStore } from '@/entities/mood';
import { supabase } from '@/shared/api/supabase/client';
import { SUPABASE_TABLES } from '@/shared/api/supabase/constants/tables';
import { mapUserFromDb, type SupabaseUserRow, type SupabaseUserMoodTagRow } from '@/shared/api/supabase/mappers';
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
      
      Promise.all([
        pairApi.getPartner(pairId, userId),
        placesApi.getPlaces(pairId),
        pairApi.getPairData(pairId),
        pairApi.getSelectedMoodTags(pairId)
      ]).then(([partner, places, data, selectedTags]) => {
        usePairStore.getState().setPartnerUser(partner);
        usePlaceStore.getState().setPlacesData(places, data.placeCategories, data.budgetTiers);
        useWishTagsStore.getState().setTags(data.moodTags);
        const myIds = selectedTags.filter(t => t.userId === userId).map(t => t.tagId);
        const partnerIds = selectedTags.filter(t => t.userId !== userId).map(t => t.tagId);
        useWishTagsStore.getState().setSelectedTags(myIds, partnerIds);
      }).catch(err => {
        console.error('Data Sync Error:', err);
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
        (payload: RealtimePostgresChangesPayload<SupabaseUserMoodTagRow>) => {
          const { eventType, new: newRecord, old: oldRecord } = payload;
          if (eventType === 'INSERT' && newRecord) {
            if (newRecord.user_id !== userId) {
              useWishTagsStore.getState().markPartnerTag(newRecord.tag_id);
            }
          } else if (eventType === 'DELETE' && oldRecord && 'tag_id' in oldRecord) {
            const partnerTagRecord = oldRecord as Partial<SupabaseUserMoodTagRow>;
            if (partnerTagRecord.user_id !== userId && partnerTagRecord.tag_id) {
              const currentPartnerTags = useWishTagsStore.getState().partnerSelectedTagIds;
              useWishTagsStore.getState().setPartnerSelectedTags(
                currentPartnerTags.filter((id: string) => id !== partnerTagRecord.tag_id)
              );
            }
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: SUPABASE_TABLES.USERS, filter: `pair_id=eq.${pairId}` },
        (payload: RealtimePostgresChangesPayload<SupabaseUserRow>) => {
          // If the changed user is the partner, update the partner store
          const newData = payload.new;
          if (newData && 'id' in newData && newData.id !== userId) {
            const mappedPartner = mapUserFromDb(newData as SupabaseUserRow);
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
