import type { FC } from 'react';
import { AppHeader } from '../AppHeader/AppHeader';
import { LockItPhotoCard } from '../LockItPhotoCard/LockItPhotoCard';
import { MoodStatusPill } from '@/entities/mood';
import { AttentionButton } from '@/features/attention';
import { useUserStore } from '@/entities/user';
import { usePairStore } from '@/entities/pair';
import { useMoodStore } from '@/entities/mood';
import { tgService } from '@/shared/lib/telegram/telegram';
import styles from './TopSection.module.scss';

export interface TopSectionProps {
  onOpenMyMood: () => void;
  onOpenPhotoUpload: () => void;
  onOpenSettings?: () => void;
}

export const TopSection: FC<TopSectionProps> = ({
  onOpenMyMood,
  onOpenPhotoUpload,
  onOpenSettings,
}) => {
  const currentUser = useUserStore(state => state.currentUser);
  const partnerUser = usePairStore(state => state.partnerUser);
  const lastSyncedAt = usePairStore(state => state.lastSyncedAt);
  const myMood = useMoodStore(state => state.myMood);
  const partnerMood = useMoodStore(state => state.partnerMood);

  const handleSendAttention = () => {
    tgService.haptic('heavy');
  };

  if (!currentUser || !partnerUser || !myMood || !partnerMood) return null;

  return (
    <section className={styles.container}>
      <AppHeader
        currentUser={currentUser}
        partnerUser={partnerUser}
        lastSyncedAt={lastSyncedAt}
        onSyncClick={onOpenSettings}
      />

      <div className={styles.photoGrid}>
        <LockItPhotoCard
          user={currentUser}
          photoUrl={myMood.locketPhotoUrl}
          photoTime={myMood.locketPhotoTime}
          isCurrentUser={true}
          onCardClick={onOpenPhotoUpload}
        />

        <LockItPhotoCard
          user={partnerUser}
          photoUrl={partnerMood.locketPhotoUrl}
          photoTime={partnerMood.locketPhotoTime}
          isCurrentUser={false}
        />
      </div>

      <div className={styles.moodRow}>
        <MoodStatusPill
          label="Моё состояние"
          emoji={myMood.emotionEmoji}
          title={myMood.emotionTitle}
          energyLevel={myMood.energyLevel}
          color={currentUser.themeColor}
          isInteractive={true}
          onClick={onOpenMyMood}
        />
        <MoodStatusPill
          label={`Настроение ${partnerUser.firstName}`}
          emoji={partnerMood.emotionEmoji}
          title={partnerMood.emotionTitle}
          energyLevel={partnerMood.energyLevel}
          color={partnerUser.themeColor}
          isInteractive={false}
        />
      </div>

      <AttentionButton
        partnerName={partnerUser.firstName}
        onSendAttention={handleSendAttention}
      />
    </section>
  );
};
