import type { PairDTO } from './types';
import { mockPartnerUserDTO } from './user.mock';

export const mockPairDTO: PairDTO = {
  id: 'pair-10001-10002',
  partner: mockPartnerUserDTO,
  togetherSince: '14 февраля 2024',
  isSync: true,
  lastSyncedAt: '18:29',
  lockItPhoto: {
    url: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=500&auto=format&fit=crop&q=80',
    updatedAt: '15:45',
    authorId: 10002,
  },
};
