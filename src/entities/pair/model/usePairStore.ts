import { create } from 'zustand';
import type { UserDTO } from '@/shared/api/mock/types';
import { tgService } from '@/shared/lib/telegram/telegram';
import { useInitStore } from '@/app/model/useInitStore';


export interface PairInviteResult {
  inviteUrl: string;
  expiresAt: string;
}

export interface PairState {
  partnerUser: UserDTO | null;
  lastSyncedAt: string;
  isLoading: boolean;
  inviteData: PairInviteResult | null;
  fetchPartner: (pairId?: string, currentUserId?: string | number) => Promise<void>;
  generateInviteLink: (userId?: string | number) => Promise<PairInviteResult>;
  unlinkPartner: () => void;
  resetPair: () => void;
  setPartnerUser: (user: UserDTO | null) => void;
}

export const usePairStore = create<PairState>((set) => ({
  partnerUser: null,
  lastSyncedAt: '18:29',
  isLoading: false,
  inviteData: null,
  
  setPartnerUser: (user) => set({ partnerUser: user }),

  fetchPartner: async (pairId?: string, currentUserId?: string | number) => {
    set({ isLoading: true });
    try {
      const api = useInitStore.getState().api;
      if (!api || !pairId) {
        set({ partnerUser: null, isLoading: false });
        return;
      }
      
      const partner = await api.getPartner(pairId, currentUserId ? String(currentUserId) : '');
      set({ partnerUser: partner, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  generateInviteLink: async (userId?: string | number) => {
    set({ isLoading: true });
    try {
      const botUsername = import.meta.env.VITE_TELEGRAM_BOT_USERNAME || 'our_soulmate_app_bot';
      const targetId = userId || 'partner';

      // Формируем прямую ссылку deep-link: https://t.me/<bot>?startapp=invite_<UUID>
      const inviteUrl = `https://t.me/${botUsername}?startapp=invite_${targetId}`;
      const result = {
        inviteUrl,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      };
      
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
    tgService.haptic('warning');
  },
  
  resetPair: () => {
    set({ partnerUser: null, inviteData: null });
    tgService.haptic('warning');
  }
}));

