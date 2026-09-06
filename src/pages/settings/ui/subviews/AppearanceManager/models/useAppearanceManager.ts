import { useState } from 'react';
import { useUserStore } from '@/entities/user';
import { useApi } from '@/app/providers/ApiProvider';

export const THEME_COLORS = [
  { value: '#FF4B4B', name: 'Красный' },
  { value: '#FF8B3E', name: 'Оранж' },
  { value: '#FFB800', name: 'Желтый' },
  { value: '#3c8159', name: 'Зеленый' },
  { value: '#00B0FF', name: 'Голубой' },
  { value: '#651FFF', name: 'Лиловый' },
  { value: '#AA00FF', name: 'Пурпур' },
  { value: '#be2a5e', name: 'Розовый' },
];

export const useAppearanceManager = (onBack: () => void) => {
  const { currentUser, updateThemeColor } = useUserStore();
  const { userApi } = useApi();
  const [selectedColor, setSelectedColor] = useState(currentUser?.themeColor || '#FF4B4B');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!currentUser) return;
    setIsSaving(true);
    try {
      if (userApi) {
        await userApi.updateThemeColor(currentUser.id, selectedColor);
      }
      await updateThemeColor(selectedColor);
      onBack();
    } catch (e) {
      console.error('Failed to update theme color', e);
    } finally {
      setIsSaving(false);
    }
  };

  const isChanged = selectedColor !== currentUser?.themeColor;

  return {
    selectedColor,
    setSelectedColor,
    isSaving,
    isChanged,
    handleSave,
    colors: THEME_COLORS,
  };
};
