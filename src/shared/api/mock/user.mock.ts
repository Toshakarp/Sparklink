import type { UserDTO, MoodStatusDTO } from './types';

export const mockCurrentUserDTO: UserDTO = {
  id: 10001,
  telegramId: 10001,
  firstName: 'Алекс',
  lastName: 'Иванов',
  username: 'alex_dev',
  photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  themeColor: '#ff2d55',
  notificationsEnabled: true,
};

export const mockPartnerUserDTO: UserDTO = {
  id: 10002,
  telegramId: 10002,
  firstName: 'Ева',
  lastName: 'Смирнова',
  username: 'eva_art',
  photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
  themeColor: '#00e5ff',
  notificationsEnabled: true,
};

export const mockMyMoodDTO: MoodStatusDTO = {
  id: 'mood-my-1',
  userId: 10001,
  emotionId: '1',
  emotionTitle: 'Радость',
  emotionEmoji: '😊',
  energyLevel: 80,
  locketPhotoUrl: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=500&auto=format&fit=crop&q=80',
  locketPhotoTime: 'Сегодня, 14:20',
  updatedAt: new Date().toISOString(),
};

export const mockPartnerMoodDTO: MoodStatusDTO = {
  id: 'mood-partner-1',
  userId: 10002,
  emotionId: '8',
  emotionTitle: 'Вдохновение',
  emotionEmoji: '🤩',
  energyLevel: 95,
  locketPhotoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500&auto=format&fit=crop&q=80',
  locketPhotoTime: 'Сегодня, 15:45',
  updatedAt: new Date().toISOString(),
};
