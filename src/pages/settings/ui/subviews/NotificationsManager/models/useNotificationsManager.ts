import { useUserStore } from '@/entities/user';

export const useNotificationsManager = () => {
  const currentUser = useUserStore((state) => state.currentUser);
  const updateNotifications = useUserStore((state) => state.updateNotifications);
  const isEnabled = currentUser?.notificationsEnabled ?? true;

  const handleToggle = (enabled: boolean) => {
    updateNotifications(enabled);
  };

  return {
    isEnabled,
    handleToggle,
  };
};
