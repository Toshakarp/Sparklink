import { create } from 'zustand';
import { pairApi, type PairInviteResult } from '../api/pairApi';
import type { UserDTO } from '@/shared/api/mock/types';
import { tgService } from '@/shared/lib/telegram/telegram';

interface PairState {
  partnerUser: UserDTO | null;
  lastSyncedAt: string;
  isLoading: boolean;
  inviteData: PairInviteResult | null;
  fetchPartner: (isDemo?: boolean) => Promise<void>;
  generateInviteLink: (userId?: string | number) => Promise<PairInviteResult>;
  unlinkPartner: () => void;
  resetPair: () => void;
}

export const usePairStore = create<PairState>((set) => ({
  partnerUser: null,
  lastSyncedAt: '18:29',
  isLoading: false,
  inviteData: null,

  fetchPartner: async (isDemo = false) => {
    set({ isLoading: true });
    try {
      const user = await pairApi.getPartnerUser(isDemo);
      set({ partnerUser: user, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  generateInviteLink: async (userId?: string | number) => {

    set({ isLoading: true });
    try {
      const result = await pairApi.createInviteLink(userId);
      set({ inviteData: result, isLoading: false });
      return result;
    } catch (e) {
      set({ isLoading: false });
      throw e;
    }
  },

  unlinkPartner: () => {
    set((state) => ({
      partnerUser: state.partnerUser ? {
        ...state.partnerUser,
        firstName: 'Не привязан',
        lastName: '',
        username: '',
        photoUrl: null,
      } : null
    }));
    pairApi.unlinkPartner();
    tgService.haptic('warning');
  },

  resetPair: () => {
    set({ partnerUser: null, inviteData: null });
    tgService.haptic('warning');
  }
}));

