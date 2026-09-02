import { useState, useEffect, useCallback } from 'react';
import { useUserStore } from '@/entities/user';
import { usePairStore } from '@/entities/pair';
import { tgService } from '@/shared/lib/telegram/telegram';

// ============================================================================
// Хук генерации ссылки и привязки второй половинки
// ============================================================================
export interface UseLinkPartnerReturn {
  inviteUrl: string;
  inviteCode: string;
  isLoading: boolean;
  isCopied: boolean;
  handleCopyLink: () => Promise<void>;
  handleShareTelegram: () => void;
  error: string | null;
}

export const useLinkPartner = (isOpen: boolean): UseLinkPartnerReturn => {
  const currentUser = useUserStore((state) => state.currentUser);
  const generateInviteLink = usePairStore((state) => state.generateInviteLink);
  const inviteData = usePairStore((state) => state.inviteData);

  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen && isCopied) {
    setIsCopied(false);
  }

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const initInvite = async () => {
      if (inviteData?.inviteUrl) return;

      setIsLoading(true);
      setError(null);
      try {
        await generateInviteLink(currentUser?.telegramId || currentUser?.id);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Не удалось сгенерировать ссылку';
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    initInvite();
  }, [isOpen, inviteData?.inviteUrl, currentUser?.id, currentUser?.telegramId, generateInviteLink]);

  const handleCopyLink = useCallback(async () => {
    const url = inviteData?.inviteUrl;
    if (!url) return;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
      }
      setIsCopied(true);
      tgService.haptic('success');

      setTimeout(() => {
        setIsCopied(false);
      }, 2500);
    } catch {
      tgService.haptic('error');
    }
  }, [inviteData?.inviteUrl]);

  const handleShareTelegram = useCallback(() => {
    const url = inviteData?.inviteUrl;
    if (!url) return;

    const shareText = encodeURIComponent(
      'Привет! Давай объединим наши профили в sparklinkTma, чтобы планировать свидания и делиться настроением 💕'
    );
    const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${shareText}`;

    tgService.haptic('medium');
    
    if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp?.openTelegramLink) {
      (window as any).Telegram.WebApp.openTelegramLink(shareUrl);
    } else {
      window.open(shareUrl, '_blank');
    }
  }, [inviteData?.inviteUrl]);

  return {
    inviteUrl: inviteData?.inviteUrl || '',
    inviteCode: inviteData?.inviteUrl || '',
    isLoading,
    isCopied,
    handleCopyLink,
    handleShareTelegram,
    error,
  };
};
