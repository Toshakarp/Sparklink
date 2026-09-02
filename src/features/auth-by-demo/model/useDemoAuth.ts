import { useState } from 'react';
import { tgService } from '@/shared/lib/telegram/telegram';
import { useInitStore } from '@/app/model/useInitStore';
import { useUserStore } from '@/entities/user/model/useUserStore';
import { createMockRepository } from '@/shared/api/core/MockRepository';

// ============================================================================
// Хук авторизации в демо-режиме (для тестирования в обычном браузере)
// ============================================================================
export const useDemoAuth = (onSuccess?: () => void) => {
  const [isLoading, setIsLoading] = useState(false);
  const initStore = useInitStore();
  const userStore = useUserStore();

  // --------------------------------------------------------------------------
  // Активация демонстрационного профиля и переключение на мок-репозиторий
  // --------------------------------------------------------------------------
  const handleDemoAuth = async () => {
    setIsLoading(true);
    tgService.haptic('medium');
    
    const tgUser = tgService.getTelegramUser();
    
    // Включаем Mock-репозиторий с тестовыми данными
    const mockApi = createMockRepository(tgUser ? {
      id: tgUser.id.toString(),
      telegramId: tgUser.id.toString(),
      firstName: tgUser.first_name || 'Пользователь',
      photoUrl: tgUser.photo_url || undefined
    } : undefined);
    initStore.setApi(mockApi);
    
    // Получаем тестового пользователя и сохраняем в store
    const mockUser = await mockApi.getUserByTelegramId(tgUser?.id?.toString() || 'demo_user');
    userStore.setCurrentUser(mockUser);
    
    // Переводим статус приложения в режим готовности
    initStore.setStatus('telegram_ready');
    if (onSuccess) onSuccess();
    
    tgService.haptic('success');
    setIsLoading(false);
  };

  return { handleDemoAuth, isLoading };
};

