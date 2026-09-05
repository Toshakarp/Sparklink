import { useState, useCallback } from 'react';
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
  const botname = import.meta.env.VITE_TELEGRAM_BOT_USERNAME;
  const currentUser = useUserStore((state) => state.currentUser);
  const inviteUrl = currentUser?.telegramId
    ? `https://t.me/${botname}/app?startapp=invite_${currentUser.telegramId}`
    : '';

  const [isLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [error] = useState<string | null>(null);

  // If the modal is closed, we can just derive it as false. 
  // The state will reset itself via the setTimeout anyway.
  const displayIsCopied = isOpen && isCopied;

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
    isCopied: displayIsCopied,
    handleCopyLink,
    handleShareTelegram,
    error,
  };
};
