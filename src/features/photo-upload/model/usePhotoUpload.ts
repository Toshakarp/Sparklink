import { useState, useRef, useCallback } from 'react';
import type { ChangeEvent } from 'react';
import { tgService } from '@/shared/lib/telegram/telegram';

export const PRESET_MOMENTS = [
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&auto=format&fit=crop&q=80',
];

export interface UsePhotoUploadOptions {
  currentPhotoUrl?: string | null;
  onSavePhoto?: (photoUrl: string) => void;
  onClose: () => void;
}

export const usePhotoUpload = ({ currentPhotoUrl, onSavePhoto, onClose }: UsePhotoUploadOptions) => {
  const [photoUrl, setPhotoUrl] = useState<string>(currentPhotoUrl || PRESET_MOMENTS[0]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // TODO: [Supabase Storage & TMA Camera Integration]
    // 1. In TMA, optionally trigger native camera/photo picker:
    //    window.Telegram?.WebApp?.showPopup(...) or native file reader.
    // 2. Compress image client-side and upload to Supabase bucket:
    //    const { data } = await supabase.storage.from('locket').upload(`${pairId}/${Date.now()}.jpg`, file);
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setPhotoUrl(event.target.result as string);
        tgService.haptic('light');
      }
    };
    reader.readAsDataURL(file);
  }, []);

  const handleSelectPreset = useCallback((presetUrl: string) => {
    setPhotoUrl(presetUrl);
    tgService.haptic('light');
  }, []);

  const handleOpenPicker = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleConfirm = useCallback(async () => {
    if (!photoUrl) return;

    setIsUploading(true);
    try {
      // TODO: [Supabase Realtime Sync]
      // Broadcast new photo event to partner's feed:
      // await supabase.channel(`locket_${pairId}`).send({ type: 'broadcast', event: 'new_photo', payload: { url: photoUrl } });
      onSavePhoto?.(photoUrl);
      tgService.haptic('success');
      onClose();
    } finally {
      setIsUploading(false);
    }
  }, [photoUrl, onSavePhoto, onClose]);

  return {
    photoUrl,
    isUploading,
    fileInputRef,
    presets: PRESET_MOMENTS,
    handleFileChange,
    handleSelectPreset,
    handleOpenPicker,
    handleConfirm,
  };
};
