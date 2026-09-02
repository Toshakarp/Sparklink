import { useState } from 'react';
import { tgService } from '@/shared/lib/telegram/telegram';
import { useInitStore } from '@/app/model/useInitStore';
import { useUserStore } from '@/entities/user/model/useUserStore';
import { createMockRepository } from '@/shared/api/core/MockRepository';

export const useDemoAuth = (onSuccess?: () => void) => {
  const [isLoading, setIsLoading] = useState(false);
  const initStore = useInitStore();
  const userStore = useUserStore();

  const handleDemoAuth = async () => {
    setIsLoading(true);
    tgService.haptic('medium');
    
    const mockApi = createMockRepository();
    initStore.setApi(mockApi);
    
    const mockUser = await mockApi.getUserByTelegramId('demo_user');
    userStore.setCurrentUser(mockUser);

    initStore.setStatus('telegram_ready');
    if (onSuccess) onSuccess();
    
    tgService.haptic('success');
    setIsLoading(false);
  };

  return { handleDemoAuth, isLoading };
};

