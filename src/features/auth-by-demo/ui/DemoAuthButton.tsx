import type { FC, ButtonHTMLAttributes } from 'react';
import { Sparkles } from 'lucide-react';
import { Button } from '@/shared/ui';
import { useDemoAuth } from '../model/useDemoAuth';
import styles from './DemoAuthButton.module.scss';

export interface DemoAuthButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  onSuccess?: () => void;
  label?: string;
}

export const DemoAuthButton: FC<DemoAuthButtonProps> = ({
  onSuccess,
  label = 'Использовать демо-данные',
  className = '',
  disabled,
  ...restProps
}) => {
  const { isLoading, handleDemoAuth } = useDemoAuth(onSuccess);

  return (
    <Button
      type="button"
      variant="secondary"
      fullWidth
      onClick={handleDemoAuth}
      disabled={disabled || isLoading}
      icon={<Sparkles size={18} className={styles.icon} />}
      className={className}
      {...restProps}
    >
      {isLoading ? 'Загрузка данных...' : label}
    </Button>
  );
};

