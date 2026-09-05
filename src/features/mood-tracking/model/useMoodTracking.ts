import { useState, useCallback } from 'react';
import type { EmotionDTO } from '@/shared/api/types/models';
import { DEFAULT_EMOTIONS } from '@/shared/config/constants';
import { tgService } from '@/shared/lib/telegram/telegram';

export interface UseMoodTrackingOptions {
  isOpen: boolean;
  currentEmotionId?: string;
  currentEnergyLevel?: number;
  emotions?: EmotionDTO[];
  onSaveMood?: (emotionId: string, energyLevel: number) => void;
  onClose: () => void;
}

export const useMoodTracking = ({
  isOpen,
  currentEmotionId,
  currentEnergyLevel = 50,
  emotions = DEFAULT_EMOTIONS,
  onSaveMood,
  onClose,
}: UseMoodTrackingOptions) => {
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  const [selectedEmotionId, setSelectedEmotionId] = useState<string>(
    currentEmotionId || emotions[0]?.id || '1'
  );
  const [energyLevel, setEnergyLevel] = useState<number>(currentEnergyLevel);

  if (prevIsOpen !== isOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) {
      setSelectedEmotionId(currentEmotionId || emotions[0]?.id || '1');
      setEnergyLevel(currentEnergyLevel ?? 50);
    }
  }

  const handleSelectEmotion = useCallback((id: string) => {
    setSelectedEmotionId(id);
    tgService.haptic('light');
  }, []);

  const handleEnergyChange = useCallback((value: number) => {
    setEnergyLevel(value);
  }, []);

  const handleSave = useCallback(async () => {
    // TODO: [Supabase Realtime & Telegram Bot Sync]
    // 1. Persist mood update in Supabase:
    //    await supabase.from('mood_statuses').upsert({ user_id: currentUserId, emotion_id: selectedEmotionId, energy_level: energyLevel });
    // 2. Broadcast realtime status to connected partner device.
    onSaveMood?.(selectedEmotionId, energyLevel);
    tgService.haptic('success');
    onClose();
  }, [selectedEmotionId, energyLevel, onSaveMood, onClose]);

  return {
    selectedEmotionId,
    energyLevel,
    handleSelectEmotion,
    handleEnergyChange,
    handleSave,
  };
};
