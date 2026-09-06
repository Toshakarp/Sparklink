import type { FC } from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/shared/ui';

export interface RetryAuthButtonProps {
  onRetry: () => void;
  isLoading?: boolean;
}

export const RetryAuthButton: FC<RetryAuthButtonProps> = ({ onRetry, isLoading }) => {
  return (
    <Button
      type="button"
      variant={isLoading ? 'secondary' : 'warning'}
      fullWidth
      onClick={onRetry}
      disabled={isLoading}
      icon={<RefreshCw size={18} />}
    >
      {isLoading ? 'Подключение...' : 'Повторить попытку'}
    </Button>
  );
};
