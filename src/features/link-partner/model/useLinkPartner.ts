import { useState, useEffect, useCallback } from 'react';
import { useUserStore } from '@/entities/user';
import { tgService } from '@/shared/lib/telegram/telegram';


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
  const inviteUrl = currentUser?.id
    ? `https://t.me/sparklinkTMA_bot/app?startapp=invite_${currentUser.id}`
    : '';

  const [isLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [error] = useState<string | null>(null);

  if (!isOpen && isCopied) {
    setIsCopied(false);
  }

  useEffect(() => {
    if (!isOpen) {
      return;
    }})

  const handleCopyLink = useCallback(async () => {
    if (!inviteUrl) return;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(inviteUrl);
      }
      setIsCopied(true);
      tgService.haptic('success');

      setTimeout(() => {
        setIsCopied(false);
      }, 2500);
    } catch {
      tgService.haptic('error');
    }
  }, [inviteUrl]);

  const handleShareTelegram = useCallback(() => {
    if (!inviteUrl) return;

    const shareText = encodeURIComponent(
      'Привет! Давай объединим наши профили в sparklinkTma, чтобы планировать свидания и делиться настроением 💕'
    );
    const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(inviteUrl)}&text=${shareText}`;

    tgService.haptic('medium');
    tgService.openTelegramLink(shareUrl);
  }, [inviteUrl]);

  return {
    inviteUrl,
    inviteCode: inviteUrl,
    isLoading,
    isCopied,
    handleCopyLink,
    handleShareTelegram,
    error,
  };
};
