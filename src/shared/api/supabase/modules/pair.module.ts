import { supabase } from '../client';
import { SUPABASE_TABLES } from '../constants/tables';
import { mapUserFromDb } from '../mappers';
import { seedPairInitialData } from '../services/seedPair';
import type { UserDTO } from '../../types/models';

export const getPartner = async (pairId: string, currentUserId: string): Promise<UserDTO | null> => {
  const { data, error } = await supabase
    .from(SUPABASE_TABLES.USERS)
    .select('*')
    .eq('pair_id', pairId)
    .neq('id', currentUserId)
    .single();

  if (error || !data) return null;
  return mapUserFromDb(data);
};

export const createPairWithInvite = async (inviterParam: string, currentUserId: string): Promise<{ pairId: string; partner: UserDTO | null }> => {
  let inviterQuery = supabase.from(SUPABASE_TABLES.USERS).select('*');
  if (inviterParam.includes('-')) {
    inviterQuery = inviterQuery.eq('id', inviterParam);
  } else {
    inviterQuery = inviterQuery.eq('telegram_id', inviterParam);
  }

  const { data: inviter, error: inviterErr } = await inviterQuery.single();
  if (inviterErr || !inviter) {
    throw new Error('Пригласивший пользователь не найден');
  }

  if (inviter.id === currentUserId) {
    return { pairId: inviter.pair_id || '', partner: null };
  }

  let pairId = inviter.pair_id;
  if (pairId) {
    const { data: existingMembers, error: membersErr } = await supabase
      .from(SUPABASE_TABLES.USERS)
      .select('id')
      .eq('pair_id', pairId);

    if (!membersErr && existingMembers && existingMembers.length >= 2) {
      if (!existingMembers.some((m) => m.id === currentUserId)) {
        throw new Error('В этой паре уже есть 2 партнера!');
      }
    }
  } else {
    const { data: newPair, error: pairErr } = await supabase
      .from(SUPABASE_TABLES.PAIRS)
      .insert([{}])
      .select('*')
      .single();

    if (pairErr) {
      throw new Error('Не удалось создать пару');
    }

    pairId = newPair.id;
    await seedPairInitialData(pairId);
    await supabase
      .from(SUPABASE_TABLES.USERS)
      .update({ pair_id: pairId })
      .eq('id', inviter.id);
  }

  await supabase
    .from(SUPABASE_TABLES.USERS)
    .update({ pair_id: pairId })
    .eq('id', currentUserId);

  const partnerUser = mapUserFromDb(inviter);
  partnerUser.pairId = pairId;

  return { pairId, partner: partnerUser };
};
