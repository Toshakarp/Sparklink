import type { NotificationSettingsDTO } from '@/shared/api/mock';

export interface NotificationOptionItem {
  key: keyof NotificationSettingsDTO;
  title: string;
  description: string;
}

export const NOTIFICATION_ITEMS: NotificationOptionItem[] = [
  {
    key: 'partnerAttention',
    title: 'Внимание от партнёра',
    description: 'Вибрация и пуш при нажатии кнопки внимания',
  },
  {
    key: 'moodUpdates',
    title: 'Смена настроения',
    description: 'Когда партнёр обновляет статус настроения',
  },
  {
    key: 'newLockItPhotos',
    title: 'Новые фото Lock It',
    description: 'Когда партнёр отправляет свежий снимок момента',
  },
  {
    key: 'soundAndHaptics',
    title: 'Звук и тактильный отклик',
    description: 'Haptic-эффекты и щелчки при нажатиях',
  },
];
