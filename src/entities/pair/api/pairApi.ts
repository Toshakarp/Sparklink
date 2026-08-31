import { mockPartnerUserDTO } from '@/shared/api/mock/user.mock';
import type { UserDTO } from '@/shared/api/mock/types';

export interface PairInviteResult {
  inviteCode: string;
  inviteUrl: string;
}

export const pairApi = {
  /**
   * Fetches linked partner profile for the current user.
   */
  async getPartnerUser(isDemo = false): Promise<UserDTO | null> {
    // TODO: [Supabase Integration]
    // Fetch pair from database:
    // const { data, error } = await supabase
    //   .from('pairs')
    //   .select('partner:users!partner_id(*)')
    //   .eq('user_id', currentUserId)
    //   .eq('status', 'active')
    //   .maybeSingle();
    // if (error || !data) return null;
    // return data.partner;

    if (isDemo) {
      return Promise.resolve(mockPartnerUserDTO);
    }
    return Promise.resolve(null);
  },

  /**
   * Generates a unique invitation link to link partner with the current user.
   */
  async createInviteLink(userId?: string | number): Promise<PairInviteResult> {
    // TODO: [Supabase Integration]
    // 1. Generate unique cryptographic code:
    //    const code = crypto.randomUUID().slice(0, 8);
    // 2. Insert into 'pair_invites' table:
    //    await supabase.from('pair_invites').insert({
    //      created_by: userId,
    //      invite_code: code,
    //      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    //    });

    const code = `pair_${userId || 10001}_${Math.random().toString(36).substring(2, 8)}`;
    // Telegram Bot Mini App Deep Link format
    const botUsername = 'UsCoupleAppBot'; // TODO: Configurable bot username from env
    const inviteUrl = `https://t.me/${botUsername}/app?startapp=${code}`;

    return Promise.resolve({
      inviteCode: code,
      inviteUrl,
    });
  },

  /**
   * Checks if the partner has accepted the invite and linked their profile.
   */
  async checkPairStatus(_userId?: string | number): Promise<{ isPaired: boolean; partner: UserDTO | null }> {
    // TODO: [Supabase Integration]
    // Query 'pairs' table or subscribe to Supabase Realtime channel:
    // supabase.channel('pair_status').on('postgres_changes', { event: 'INSERT', table: 'pairs' }, (payload) => { ... });
    return Promise.resolve({
      isPaired: false,
      partner: null,
    });
  },

  /**
   * Unlinks the current partner from the pair relationship.
   */
  async unlinkPartner(_userId?: string | number): Promise<void> {

    // TODO: [Supabase Integration]
    // Update relationship status to 'unlinked' or delete row:
    // await supabase.from('pairs').delete().or(`user_id.eq.${userId},partner_id.eq.${userId}`);
    return Promise.resolve();
  },
};

export const pairService = pairApi;
