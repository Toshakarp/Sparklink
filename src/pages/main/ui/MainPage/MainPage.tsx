import { useState } from 'react';
import type { FC } from 'react';
import { TopSection } from '@/widgets/top-section';
import { OurMoodSection } from '@/widgets/mood-section';
import { MoodSelectorModal } from '@/features/mood-tracking';
import { PhotoUploadModal } from '@/features/photo-upload';
import { useMoodStore } from '@/entities/mood';
import styles from './MainPage.module.scss';

export interface MainPageProps {
  onOpenSettings?: () => void;
}

export const MainPage: FC<MainPageProps> = ({ onOpenSettings }) => {
  const [isMoodModalOpen, setIsMoodModalOpen] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);

  const myMood = useMoodStore((state) => state.myMood);
  const saveMood = useMoodStore((state) => state.saveMood);
  const saveMyPhoto = useMoodStore((state) => state.saveMyPhoto);

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <TopSection
          onOpenMyMood={() => setIsMoodModalOpen(true)}
          onOpenPhotoUpload={() => setIsPhotoModalOpen(true)}
          onOpenSettings={onOpenSettings}
        />
        <OurMoodSection />
      </div>

      <MoodSelectorModal
        isOpen={isMoodModalOpen}
        onClose={() => setIsMoodModalOpen(false)}
        currentEmotionId={myMood?.emotionId}
        currentEnergyLevel={myMood?.energyLevel}
        onSaveMood={saveMood}
      />

      <PhotoUploadModal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        currentPhotoUrl={myMood?.locketPhotoUrl}
        onSavePhoto={saveMyPhoto}
      />
    </div>
  );
};
