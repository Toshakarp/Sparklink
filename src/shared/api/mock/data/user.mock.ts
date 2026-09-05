import type { UserDTO } from '../../types/models';

export const mockCurrentUserDTO: UserDTO = {
  id: '10001',
  telegramId: '10001',
  firstName: 'dev',
  photoUrl:
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  themeColor: '#ff2d55',
  moodId: 'happy',
  energyLevel: 80,
  pairId: 'mock-pair-id',
  lockitPhotoUrl: null,
};

export const mockPartnerUserDTO: UserDTO = {
  id: '10002',
  telegramId: '10002',
  firstName: 'Ева',
  photoUrl:
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
  themeColor: '#00e5ff',
  moodId: 'inspired',
  energyLevel: 95,
  pairId: 'mock-pair-id',
  lockitPhotoUrl: null,
};
