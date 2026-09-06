import { useState } from 'react';
import type { FC } from 'react';
import { RefreshCw, Check } from 'lucide-react';
import { Button } from '@/shared/ui';
import { useSyncAll } from '../../model/useSyncAll';
import { tgService } from '@/shared/lib/telegram/telegram';
import { usePairStore } from '@/entities/pair';
import { useCooldown } from '@/shared/lib/hooks';

export const SyncDataButton: FC = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const { isCooldown, trigger: triggerCooldown } = useCooldown(3000);
  const { syncAll } = useSyncAll();
  const lastSyncedAt = usePairStore(state => state.lastSyncedAt);

  const handleSync = async () => {
    if (isSyncing || isCooldown) return;

    triggerCooldown();
    setIsSyncing(true);
    tgService.haptic('medium');
    try {
      await syncAll();
      tgService.haptic('success');
    } catch (e) {
      console.error(e);
      tgService.haptic('error');
    } finally {
      // Small visual delay so the user sees the spinner for at least a bit
      setTimeout(() => setIsSyncing(false), 500);
    }
  };

  const getSyncText = () => {
    if (!lastSyncedAt) return 'Синхронизировать данные';
    const date = new Date(lastSyncedAt);
    const timeStr = date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    return `Синхронизировано в ${timeStr}`;
  };

  const isDisabled = isSyncing || isCooldown;

  return (
    <Button
      type="button"
      variant="attention"
      fullWidth
      onClick={handleSync}
      disabled={isDisabled}
      icon={
        isSyncing ? (
          <RefreshCw size={18} className="animate-spin" />
        ) : isCooldown ? (
          <Check size={18} />
        ) : (
          <RefreshCw size={18} />
        )
      }
      style={{ marginBottom: '16px' }}
    >
      {isSyncing ? 'Обновление...' : getSyncText()}
    </Button>
  );
};
