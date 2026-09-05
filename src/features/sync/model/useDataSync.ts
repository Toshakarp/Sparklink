import { useEffect, useCallback } from 'react';
import { useApi } from '@/app/providers/ApiProvider';
import { useUserStore } from '@/entities/user';
import { usePairStore } from '@/entities/pair';
import { usePlaceStore } from '@/entities/place';
import { useWishTagsStore } from '@/entities/mood';
import { useAppInit } from '@/features/auth';
import { supabase } from '@/shared/api/supabase/client';

export const useDataSync = () => {
  const { status } = useAppInit();
  const { placesApi, pairApi } = useApi();
  const isAuth = useUserStore((state) => state.isAuth);
  const currentUser = useUserStore((state) => state.currentUser);

  const resyncMoodTags = useCallback((pairId: string, currentUserId: string) => {
    if (!pairApi) return;
    pairApi.getSelectedMoodTags(pairId).then((selectedTags) => {
      const partnerIds = selectedTags.filter((t) => t.userId !== currentUserId).map((t) => t.tagId);
      useWishTagsStore.getState().setPartnerSelectedTags(partnerIds);
      usePairStore.setState({ lastSyncedAt: new Date().toISOString() });
    }).catch((err) => console.error('[Sync] Mood tags resync error:', err));
  }, [pairApi]);

  const resyncPartner = useCallback((pairId: string, currentUserId: string) => {
    if (!pairApi) return;
    pairApi.getPartner(pairId, currentUserId).then((partner) => {
      if (partner) {
        usePairStore.getState().setPartnerUser(partner);
        usePairStore.setState({ lastSyncedAt: new Date().toISOString() });
      }
    }).catch((err) => console.error('[Sync] Partner resync error:', err));
  }, [pairApi]);

  const resyncPlaces = useCallback((pairId: string) => {
    if (!placesApi) return;
    placesApi.getPlaces(pairId).then((places) => {
      const currentCategories = usePlaceStore.getState().dateTags;
      const currentBudgets = usePlaceStore.getState().budgetTiers;
      usePlaceStore.getState().setPlacesData(places, currentCategories, currentBudgets);
      usePairStore.setState({ lastSyncedAt: new Date().toISOString() });
    }).catch((err) => console.error('[Sync] Places resync error:', err));
  }, [placesApi]);

  // 1. Initial Data Fetching
  useEffect(() => {
    if ((status === 'telegram_ready' || status === 'browser_mock') && isAuth && currentUser?.pairId && pairApi && placesApi) {
      const pairId = currentUser.pairId;
      const userId = currentUser.id;

      Promise.all([
        pairApi.getPartner(pairId, userId),
        placesApi.getPlaces(pairId),
        pairApi.getPairData(pairId),
        pairApi.getSelectedMoodTags(pairId),
      ]).then(([partner, places, data, selectedTags]) => {
        usePairStore.getState().setPartnerUser(partner);
        usePlaceStore.getState().setPlacesData(places, data.placeCategories, data.budgetTiers);
        useWishTagsStore.getState().setTags(data.moodTags);
        const myIds = selectedTags.filter((t) => t.userId === userId).map((t) => t.tagId);
        const partnerIds = selectedTags.filter((t) => t.userId !== userId).map((t) => t.tagId);
        useWishTagsStore.getState().setSelectedTags(myIds, partnerIds);
        usePairStore.setState({ lastSyncedAt: new Date().toISOString() });
      }).catch((err) => {
        console.error('Data Sync Error:', err);
      });
    }
  }, [status, isAuth, currentUser?.pairId, currentUser?.id, pairApi, placesApi]);

  // 2. Realtime Subscription via Supabase postgres_changes
  useEffect(() => {
    if (!currentUser?.id) return;
    const userId = currentUser.id;
    
    // If the user does not have a pairId yet, we just subscribe to their own row
    // to detect when a pairId is set (meaning a partner linked with them)
    if (!currentUser.pairId) {
      const channel = supabase
        .channel(`user-sync-${userId}`)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'users',
            filter: `id=eq.${userId}`,
          },
          (payload) => {
            const newRecord = payload.new as { pair_id?: string | null };
            if (newRecord?.pair_id) {
              const freshUser = useUserStore.getState().currentUser;
              if (freshUser) {
                useUserStore.getState().setCurrentUser({ ...freshUser, pairId: newRecord.pair_id });
              }
            }
          }
        )
        .subscribe();
      return () => {
        supabase.removeChannel(channel);
      };
    }

    // If we DO have a pairId, subscribe to pair data
    const pairId = currentUser.pairId;
    const channel = supabase
      .channel(`pair-sync-${pairId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'places',
          filter: `pair_id=eq.${pairId}`,
        },
        () => {
          resyncPlaces(pairId);
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'users',
          filter: `pair_id=eq.${pairId}`,
        },
        (payload) => {
          const record = (payload.new || payload.old) as { id?: string } | undefined;
          if (record?.id !== userId) {
            resyncPartner(pairId, userId);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_mood_tags',
          filter: `pair_id=eq.${pairId}`,
        },
        () => {
          resyncMoodTags(pairId, userId);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUser?.pairId, currentUser?.id, currentUser, resyncPlaces, resyncPartner, resyncMoodTags]);

  // 3. visibility resync
  useEffect(() => {
    if (!currentUser?.pairId || !currentUser?.id) return;
    const pairId = currentUser.pairId;
    const userId = currentUser.id;

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        resyncMoodTags(pairId, userId);
        resyncPartner(pairId, userId);
        resyncPlaces(pairId);
      }
    };

    window.addEventListener('focus', handleVisibilityChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('focus', handleVisibilityChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [currentUser?.pairId, currentUser?.id, resyncMoodTags, resyncPartner, resyncPlaces]);

  return { status };
};
