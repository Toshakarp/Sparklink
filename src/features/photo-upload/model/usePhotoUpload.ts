import { useState, useRef, useCallback } from 'react';
import type { ChangeEvent } from 'react';
import { tgService } from '@/shared/lib/telegram/telegram';
import { compressImage } from '@/shared/lib/image/compressImage';

export interface UsePhotoUploadOptions {
  currentPhotoUrl?: string | null;
  onSavePhoto?: (photoUrl: string) => void;
  onClose: () => void;
}

export const usePhotoUpload = ({ currentPhotoUrl, onSavePhoto, onClose }: UsePhotoUploadOptions) => {
  const [photoUrl, setPhotoUrl] = useState(currentPhotoUrl || null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const compressedDataUrl = await compressImage(file, 800, 0.75);
      setPhotoUrl(compressedDataUrl);
      tgService.haptic('light');
    } catch (err) {
      console.error('Failed to compress image:', err);
    }
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
    handleFileChange,
    handleSelectPreset,
    handleOpenPicker,
    handleConfirm,
  };
};
