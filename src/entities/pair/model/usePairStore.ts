import { create } from 'zustand';
import type { UserDTO } from '@/shared/api/types/models';


export interface PairState {
  partnerUser: UserDTO | null;
  isLoading: boolean;
  setPartnerUser: (user: UserDTO | null) => void;
  
  generateInviteLink: (userId: string | number) => Promise<void>;
  unlinkPartner: () => void;
  lastSyncedAt?: string;
  inviteData?: { inviteUrl: string };
}

export const usePairStore = create<PairState>((set) => ({
  partnerUser: null,
  isLoading: false,
  
  setPartnerUser: (user) => set({ partnerUser: user }),
  fetchPartner: async () => {},

  lastSyncedAt: new Date().toISOString(),
  generateInviteLink: async () => {},
  unlinkPartner: () => {},
  
}));
