import type { FC } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/shared/ui';
import { useAttention } from '../../model/useAttention';

export interface AttentionButtonProps {
  partnerName?: string;
  onSendAttention?: () => void;
  cooldownMs?: number;
  className?: string;
}

export const AttentionButton: FC<AttentionButtonProps> = ({
  partnerName,
  onSendAttention,
  cooldownMs = 15000,
  className = '',
}) => {
  const { isCooldown, handleSendAttention } = useAttention(cooldownMs, onSendAttention);

  return (
    <Button
      type="button"
      variant="attention"
      fullWidth
      disabled={isCooldown}
      onClick={handleSendAttention}
      className={className}
      icon={
        <Heart
          size={18}
          fill={isCooldown ? 'currentColor' : 'none'}
        />
      }
    >
      {isCooldown
        ? `Сигнал отправлен: ${partnerName}!`
        : 'Маяк внимания'}
    </Button>
  );
};
