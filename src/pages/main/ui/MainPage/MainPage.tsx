import { useState } from 'react';
import type { FC } from 'react';
import { TopSection } from '@/widgets/top-section';
import { OurMoodSection } from '@/widgets/mood-section';
import { MoodSelectorModal } from '@/features/mood-tracking';
import { PhotoUploadModal } from '@/features/photo-upload';
import { useMoodStore } from '@/entities/mood';
import { useUserStore } from '@/entities/user';
import { useApi } from '@/app/providers/ApiProvider';
import styles from './MainPage.module.scss';

export interface MainPageProps {
  onOpenSettings?: () => void;
}

export const MainPage: FC<MainPageProps> = ({ onOpenSettings }) => {
  const [isMoodModalOpen, setIsMoodModalOpen] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);

  const { userApi } = useApi();
  const currentUser = useUserStore((state) => state.currentUser);
  const myMood = useMoodStore((state) => state.myMood);
  const updateMood = useUserStore((state) => state.updateMood);
  const updateLockitPhoto = useUserStore((state) => state.updateLockitPhoto);

  const handleSaveMood = async (emotionId: string, energyLevel: number) => {
    updateMood(emotionId, energyLevel);
    if (userApi && currentUser?.id) {
      userApi.updateUserMood(currentUser.id, energyLevel, emotionId).catch(console.error);
    }
  };

  const handleSavePhoto = async (photoUrl: string) => {
    updateLockitPhoto(photoUrl);
    if (userApi && currentUser?.id) {
      userApi.updateLockitPhoto(currentUser.id, photoUrl).catch(console.error);
    }
  };

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
        onSaveMood={handleSaveMood}
      />

      <PhotoUploadModal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        currentPhotoUrl={myMood?.locketPhotoUrl}
        onSavePhoto={handleSavePhoto}
      />
    </div>
  );
};
