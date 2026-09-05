import type { FC } from 'react';
import type { EmotionDTO } from '@/shared/api/types/models';
import { Modal, Button, Tag, Slider } from '@/shared/ui';
import { ENERGY_LEVEL_MARKS, ENERGY_STEP, DEFAULT_EMOTIONS } from '@/shared/config/constants';
import { useMoodTracking } from '../../model/useMoodTracking';
import styles from './MoodSelectorModal.module.scss';

export interface MoodSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentEmotionId?: string;
  currentEnergyLevel?: number;
  emotions?: EmotionDTO[];
  onSaveMood?: (emotionId: string, energyLevel: number) => void;
}

export const MoodSelectorModal: FC<MoodSelectorModalProps> = ({
  isOpen,
  onClose,
  currentEmotionId,
  currentEnergyLevel = 50,
  emotions = DEFAULT_EMOTIONS,
  onSaveMood,
}) => {
  const {
    selectedEmotionId,
    energyLevel,
    handleSelectEmotion,
    handleEnergyChange,
    handleSave,
  } = useMoodTracking({
    isOpen,
    currentEmotionId,
    currentEnergyLevel,
    emotions,
    onSaveMood,
    onClose,
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Как ваше самочувствие?">
      <div className={styles.container}>
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTitle}>Какая эмоция сейчас?</span>
          </div>
          <div className={styles.emotionsGrid}>
            {emotions.map((emotion) => (
              <Tag
                key={emotion.id}
                label={emotion.title}
                emoji={emotion.emoji}
                isActive={selectedEmotionId === emotion.id}
                onClick={() => handleSelectEmotion(emotion.id)}
              />
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTitle}>Уровень энергии</span>
            <span className={styles.energyValue}>{energyLevel}%</span>
          </div>
          <div className={styles.sliderWrapper}>
            <Slider
              min={0}
              max={100}
              step={ENERGY_STEP}
              value={energyLevel}
              onChange={handleEnergyChange}
            />
            <div className={styles.sliderMarks}>
              {ENERGY_LEVEL_MARKS.map((mark) => (
                <span key={mark}>{mark}%</span>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <Button type="button" variant="primary" fullWidth onClick={handleSave}>
            Сохранить настроение
          </Button>
        </div>
      </div>
    </Modal>
  );
};

