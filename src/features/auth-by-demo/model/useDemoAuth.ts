import { useState } from 'react';
import { useUserStore } from '@/entities/user';
import { usePairStore } from '@/entities/pair';
import { usePlaceStore } from '@/entities/place';
import { useMoodStore, useWishTagsStore } from '@/entities/mood';
import { tgService } from '@/shared/lib/telegram/telegram';

export interface UseDemoAuthReturn {
  isLoading: boolean;
  handleDemoAuth: () => Promise<void>;
  error: string | null;
}

export const useDemoAuth = (onSuccess?: () => void): UseDemoAuthReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setAuth = useUserStore((state) => state.setAuth);
  const fetchUser = useUserStore((state) => state.fetchUser);
  const fetchPartner = usePairStore((state) => state.fetchPartner);
  const fetchPlacesData = usePlaceStore((state) => state.fetchPlacesData);
  const fetchMoods = useMoodStore((state) => state.fetchMoods);
  const fetchTags = useWishTagsStore((state) => state.fetchTags);

  const handleDemoAuth = async () => {
    setIsLoading(true);
    setError(null);
    tgService.haptic('medium');

    try {
      // 1. Mark session as demo and authenticated
      setAuth(true, true);

      // 2. Fetch demo dataset across all domain slices
      await Promise.all([
        fetchUser(true),
        fetchPartner(true),
        fetchPlacesData(),
        fetchMoods(),
        fetchTags(),
      ]);

      tgService.haptic('success');
      onSuccess?.();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ошибка инициализации демо-режима';
      setError(message);
      tgService.haptic('error');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleDemoAuth,
    error,
  };
};
