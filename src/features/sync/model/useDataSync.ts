import { useEffect, useCallback } from 'react';
import { useApi } from '@/app/providers/ApiProvider';
import { useUserStore } from '@/entities/user';
import { usePairStore } from '@/entities/pair';
import { usePlaceStore } from '@/entities/place';
import { useWishTagsStore } from '@/entities/mood';
import { useAppInit } from '@/features/auth';
import { supabase } from '@/shared/api/supabase/client';
import { useSyncAll } from './useSyncAll';

export const useDataSync = () => {
  const { status } = useAppInit();
  const { placesApi, pairApi } = useApi();
  const isAuth = useUserStore((state) => state.isAuth);
  const currentUser = useUserStore((state) => state.currentUser);
  const { syncAll } = useSyncAll();

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

  const resyncCategoriesAndBudgets = useCallback((pairId: string) => {
    if (!pairApi) return;
    pairApi.getPairData(pairId).then((data) => {
      usePlaceStore.getState().setPlacesData(usePlaceStore.getState().dateIdeas, data.placeCategories, data.budgetTiers);
      usePairStore.setState({ lastSyncedAt: new Date().toISOString() });
    }).catch((err) => console.error('[Sync] Categories resync error:', err));
  }, [pairApi]);

  const resyncPairMoodTags = useCallback((pairId: string) => {
    if (!pairApi) return;
    pairApi.getPairData(pairId).then((data) => {
      useWishTagsStore.getState().setTags(data.moodTags);
      usePairStore.setState({ lastSyncedAt: new Date().toISOString() });
    }).catch((err) => console.error('[Sync] Mood tags data resync error:', err));
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
    if ((status === 'telegram_ready' || status === 'browser_mock') && isAuth) {
      syncAll();
    }
  }, [status, isAuth, syncAll]);

  // 2. Realtime Subscription via Supabase postgres_changes
  useEffect(() => {
    if (!currentUser?.id) return;
    const userId = currentUser.id;
    
    // If the user does not have a pairId yet, we just subscribe to their own row
    // to detect when a pairId is set (meaning a partner linked with them)
    if (!currentUser.pairId) {
      const userChannelName = `user-sync-${userId}`;
      const existingUserChannel = supabase.getChannels().find((ch) => ch.topic === `realtime:${userChannelName}`);
      if (existingUserChannel) {
        supabase.removeChannel(existingUserChannel);
      }

      const channel = supabase
        .channel(userChannelName)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'users',
            filter: `id=eq.${userId}`,
          },
          (_payload) => {
            const newRecord = _payload.new as { pair_id?: string | null };
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
    const pairChannelName = `pair-sync-${pairId}`;
    const existingPairChannel = supabase.getChannels().find((ch) => ch.topic === `realtime:${pairChannelName}`);
    if (existingPairChannel) {
      supabase.removeChannel(existingPairChannel);
    }

    const channel = supabase
      .channel(pairChannelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'places',
          filter: `pair_id=eq.${pairId}`,
        },
        (_payload) => {
          const record = (_payload.new || _payload.old) as { created_by?: string } | undefined;
          if (record?.created_by !== userId) {
            resyncPlaces(pairId);
          }
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
        (_payload) => {
          const record = (_payload.new || _payload.old) as { id?: string } | undefined;
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
        (_payload) => {
          const record = (_payload.new || _payload.old) as { user_id?: string } | undefined;
          if (record?.user_id !== userId) {
            resyncMoodTags(pairId, userId);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*' as const,
          schema: 'public',
          table: 'place_categories',
          filter: `pair_id=eq.${pairId}`,
        },
        () => {
          resyncCategoriesAndBudgets(pairId);
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*' as const,
          schema: 'public',
          table: 'mood_tags',
          filter: `pair_id=eq.${pairId}`,
        },
        () => {
          resyncPairMoodTags(pairId);
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*' as const,
          schema: 'public',
          table: 'budget_tiers',
          filter: `pair_id=eq.${pairId}`,
        },
        () => {
          resyncCategoriesAndBudgets(pairId);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUser, resyncPlaces, resyncPartner, resyncMoodTags, resyncCategoriesAndBudgets, resyncPairMoodTags]);

  // 3. visibility resync
  useEffect(() => {
    if (!currentUser?.pairId || !currentUser?.id) return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        syncAll();
      }
    };

    window.addEventListener('focus', handleVisibilityChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('focus', handleVisibilityChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [currentUser, syncAll]);

  return { status, syncAll };
};
