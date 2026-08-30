import { useCooldown } from '@/shared/lib/hooks';
import { tgService } from '@/shared/lib/telegram/telegram';

export const useAttention = (cooldownMs: number, onSendAttention?: () => void) => {
  const { isCooldown, trigger } = useCooldown(cooldownMs);

  const handleSendAttention = async () => {
    if (isCooldown) {
      tgService.haptic('warning');
      return;
    }

    // TODO: [TMA SDK & Telegram Bot Notification]
    // 1. Send instant signal to Telegram Bot webhook or Supabase Realtime broadcast:
    //    await supabase.channel(`pair_${pairId}`).send({ type: 'broadcast', event: 'attention_signal', payload: { from: userId, time: Date.now() } });
    // 2. Telegram Bot delivers push notification to partner: "💕 Твоя половинка думает о тебе!".
    trigger();
    tgService.haptic('success');
    onSendAttention?.();
  };

  return { isCooldown, handleSendAttention };
};

