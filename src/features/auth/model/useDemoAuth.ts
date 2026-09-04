import { useState } from 'react';
import { tgService } from '@/shared/lib/telegram/telegram';
import { useApi } from '@/app/providers/ApiProvider';
import { useUserStore } from '@/entities/user/model/useUserStore';
import { createMockApiSuite } from './mockAuthHelper';

export const useDemoAuth = (onSuccess?: () => void) => {
  const [isLoading, setIsLoading] = useState(false);
  const { setApis } = useApi();
  const userStore = useUserStore();

  const handleDemoAuth = async () => {
    setIsLoading(true);
    tgService.haptic('medium');

    const tgUser = tgService.getTelegramUser();
    const mockApis = createMockApiSuite(
      tgUser
        ? {
            id: tgUser.id.toString(),
            telegramId: tgUser.id.toString(),
            firstName: tgUser.first_name || 'Пользователь',
            photoUrl: tgUser.photo_url || undefined,
          }
        : undefined
    );

    setApis(mockApis);

    const mockUser = await mockApis.userApi.getUserByTelegramId(
      tgUser?.id?.toString() || 'demo_user'
    );
    userStore.setCurrentUser(mockUser);

    if (onSuccess) onSuccess();

    tgService.haptic('success');
    setIsLoading(false);
  };

  return { handleDemoAuth, isLoading };
};
