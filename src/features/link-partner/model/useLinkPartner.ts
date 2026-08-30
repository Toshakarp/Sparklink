import { useState, useEffect, useCallback } from 'react';
import { useUserStore } from '@/entities/user';
import { usePairStore } from '@/entities/pair';
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
  const generateInviteLink = usePairStore((state) => state.generateInviteLink);
  const inviteData = usePairStore((state) => state.inviteData);

  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Generate or load invite link whenever the modal opens
  useEffect(() => {
    if (!isOpen) {
      setIsCopied(false);
      return;
    }

    const initInvite = async () => {
      if (inviteData?.inviteUrl) return;

      setIsLoading(true);
      setError(null);
      try {
        // TODO: [Supabase Integration]
        // 1. Create or retrieve active invite code for current user in Supabase:
        //    const { data, error } = await supabase.rpc('generate_pair_invite', { user_id: currentUser?.id });
        // 2. Format Telegram Mini App direct start link.
        await generateInviteLink(currentUser?.id);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Не удалось сгенерировать ссылку';
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    initInvite();
  }, [isOpen, inviteData?.inviteUrl, currentUser?.id, generateInviteLink]);

  const handleCopyLink = useCallback(async () => {
    const url = inviteData?.inviteUrl;
    if (!url) return;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
      } else {
        // Fallback for non-secure contexts or webviews
        const textArea = document.createElement('textarea');
        textArea.value = url;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }

      setIsCopied(true);
      tgService.haptic('success');

      // Reset copied status after 2.5s
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
      'Привет! Давай объединим наши профили в Us, чтобы планировать свидания и делиться настроением 💕'
    );
    const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${shareText}`;

    // TODO: [Telegram SDK Integration]
    // If running in Telegram WebApp, use openTelegramLink:
    // if (window.Telegram?.WebApp?.openTelegramLink) {
    //   window.Telegram.WebApp.openTelegramLink(shareUrl);
    // } else {
    //   window.open(shareUrl, '_blank');
    // }

    tgService.haptic('medium');
    window.open(shareUrl, '_blank');
  }, [inviteData?.inviteUrl]);

  return {
    inviteUrl: inviteData?.inviteUrl || '',
    inviteCode: inviteData?.inviteCode || '',
    isLoading,
    isCopied,
    handleCopyLink,
    handleShareTelegram,
    error,
  };
};
