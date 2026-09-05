import { useState, useEffect } from 'react';
import { tgService } from '@/shared/lib/telegram/telegram';
import { useApi } from '@/app/providers/ApiProvider';
import { useUserStore } from '@/entities/user/model/useUserStore';
import { usePairStore } from '@/entities/pair/model/usePairStore';
import { createMockApiSuite } from './mockAuthHelper';

export type AppInitStatus = 'checking' | 'browser_mock' | 'telegram_no_pair' | 'telegram_ready';

export const useAppInit = () => {
  const [status, setStatus] = useState<AppInitStatus>('checking');
  const [isInitialized, setIsInitialized] = useState(false);
  const { setApis } = useApi();
  const currentUser = useUserStore((state) => state.currentUser);

  const derivedStatus = isInitialized && status === 'telegram_no_pair' && currentUser?.pairId 
    ? 'telegram_ready' 
    : status;

  useEffect(() => {
    let isMounted = true;

    const initialize = async () => {
      const startMockMode = async (tgUser?: { id: string | number; first_name?: string; photo_url?: string } | null) => {
        const mockApis = createMockApiSuite(tgUser ? {
          id: tgUser.id.toString(),
          telegramId: tgUser.id.toString(),
          firstName: tgUser.first_name || 'Пользователь',
          photoUrl: tgUser.photo_url || undefined
        } : undefined);

        if (isMounted) {
          setApis(mockApis);
          setStatus('browser_mock');
          setIsInitialized(true);
        }
      };

      try {
        const inTMA = await tgService.isAvailable();
        if (!inTMA) {
          await startMockMode();
          return;
        }

        let liveUserApi, livePlacesApi, livePairApi;
        try {
          const { createSupabaseUserApi, createSupabasePlacesApi, createSupabasePairApi } = await import('@/shared/api/supabase/index');
          liveUserApi = createSupabaseUserApi();
          livePlacesApi = createSupabasePlacesApi();
          livePairApi = createSupabasePairApi();
        } catch (err) {
          console.warn('Supabase не доступен:', err);
          await startMockMode();
          return;
        }

        const tgUser = tgService.getTelegramUser();
        if (!tgUser) {
          await startMockMode();
          return;
        }

        const fetchPromise = liveUserApi.upsertUser({
          telegramId: tgUser.id.toString(),
          firstName: tgUser.first_name || 'Пользователь',
          photoUrl: tgUser.photo_url || null,
          initDataRaw: tgService.getInitData()
        });

        const timeoutPromise = new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Timeout')), 7000));
        const currentUser = await Promise.race([fetchPromise, timeoutPromise]);

        useUserStore.getState().setCurrentUser(currentUser);

        const startParam = tgService.getStartParam();

        if (startParam && startParam.startsWith('invite_') && !currentUser.pairId) {
          const inviterParam = startParam.replace('invite_', '');
          try {
            const { pairId, partner } = await livePairApi.createPairWithInvite(inviterParam, currentUser.id);
            const updatedUser = { ...currentUser, pairId };
            useUserStore.getState().setCurrentUser(updatedUser);
            if (partner) {
              usePairStore.getState().setPartnerUser(partner);
            }
          } catch (linkErr) {
            console.warn('Ошибка привязки:', linkErr);
          }
        }

        if (isMounted) {
          setApis({ userApi: liveUserApi, placesApi: livePlacesApi, pairApi: livePairApi });
          // Ensure we check the updated state if pairId was just set
          const finalUser = useUserStore.getState().currentUser;
          setStatus(finalUser?.pairId ? 'telegram_ready' : 'telegram_no_pair');
          setIsInitialized(true);
        }
      } catch (e) {
        console.error("Init Error:", e);
        useUserStore.getState().setCurrentUser(null);
        await startMockMode(tgService.getTelegramUser());
      }
    };

    if (!isInitialized) {
      initialize();
    }
    return () => { isMounted = false; };
  }, [isInitialized, setApis]);

  return { status: derivedStatus, isInitialized };
};
