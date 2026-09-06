import type { FC } from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/shared/ui';

export interface RetryAuthButtonProps {
  onRetry: () => void;
  isLoading?: boolean;
  isCooldown?: boolean;
}

export const RetryAuthButton: FC<RetryAuthButtonProps> = ({
  onRetry,
  isLoading = false,
  isCooldown = false,
}) => {
  const isDisabled = isLoading || isCooldown;

  return (
    <Button
      type="button"
      variant={isLoading ? 'secondary' : 'warning'}
      fullWidth
      onClick={onRetry}
      disabled={isDisabled}
      icon={<RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />}
    >
      {isLoading ? 'Подключение...' : isCooldown ? 'Подождите...' : 'Повторить попытку'}
    </Button>
  );
};
