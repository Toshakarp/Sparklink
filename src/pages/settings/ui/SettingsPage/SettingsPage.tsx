import React, { useState } from 'react';
import type { FC } from 'react';
import { UnlinkModal } from '@/features/partner-management';
import { SettingsSection } from '@/widgets/settings-section';
import { PlacesManagerView } from '../subviews/PlacesManagerView';
import { MoodTagsManagerView } from '../subviews/MoodTagsManagerView';
import { DateCategoriesManagerView } from '../subviews/DateCategoriesManagerView';
import { BudgetManagerView } from '../subviews/BudgetManagerView';
import { AppearanceManagerView } from '../subviews/AppearanceManagerView';
import { NotificationsManagerView } from '../subviews/NotificationsManagerView';
import { useUserStore } from '@/entities/user';
import { usePairStore } from '@/entities/pair';
import { usePlaceStore } from '@/entities/place';
import { useWishTagsStore } from '@/entities/mood';
import { tgService } from '@/shared/lib/telegram/telegram';
import styles from './SettingsPage.module.scss';

type SubView =
  | 'none'
  | 'places'
  | 'moodTags'
  | 'dateCategories'
  | 'budgetTiers'
  | 'appearance'
  | 'notifications';

export const SettingsPage: FC = () => {
  const [currentView, setCurrentView] = useState<SubView>('none');
  const [isUnlinkModalOpen, setIsUnlinkModalOpen] = useState(false);

  const { isDemo, resetUser, logout } = useUserStore();
  const { partnerUser, resetPair, unlinkPartner } = usePairStore();
  const { dateIdeas: places, dateTags, budgetTiers } = usePlaceStore();
  const { moodTags } = useWishTagsStore();

  const handleResetData = () => {
    resetUser();
    resetPair();
    logout();
  };

  const handleExitApp = () => {
    // TODO: [TMA SDK Integration]
    // Close the Telegram Mini App window via SDK
    tgService.haptic('warning');
    tgService.close();
  };

  if (currentView === 'places') {
    return (
      <PlacesManagerView
        onBack={() => setCurrentView('none')}
      />
    );
  }

  if (currentView === 'moodTags') {
    return (
      <MoodTagsManagerView onBack={() => setCurrentView('none')} />
    );
  }

  if (currentView === 'dateCategories') {
    return (
      <DateCategoriesManagerView onBack={() => setCurrentView('none')} />
    );
  }

  if (currentView === 'budgetTiers') {
    return (
      <BudgetManagerView onBack={() => setCurrentView('none')} />
    );
  }

  if (currentView === 'appearance') {
    return (
      <AppearanceManagerView
        onBack={() => setCurrentView('none')}
      />
    );
  }

  if (currentView === 'notifications') {
    return (
      <NotificationsManagerView
        onBack={() => setCurrentView('none')}
      />
    );
  }

  return (
    <div className={styles.container}>
      <SettingsSection
        placesCount={places.length}
        dateTagsCount={Math.max(0, dateTags.length - 1)}
        moodTagsCount={moodTags.length}
        budgetTiersCount={budgetTiers.length}
        isDemo={isDemo}
        onNavigatePlaces={() => setCurrentView('places')}
        onNavigateDateCategories={() => setCurrentView('dateCategories')}
        onNavigateBudgetTiers={() => setCurrentView('budgetTiers')}
        onNavigateMoodTags={() => setCurrentView('moodTags')}
        onNavigateAppearance={() => setCurrentView('appearance')}
        onNavigateNotifications={() => setCurrentView('notifications')}
        onOpenUnlink={() => setIsUnlinkModalOpen(true)}
        onResetData={handleResetData}
        onExitApp={handleExitApp}
      />

      <UnlinkModal
        isOpen={isUnlinkModalOpen}
        onClose={() => setIsUnlinkModalOpen(false)}
        partnerName={partnerUser?.firstName || 'Партнёр'}
        onConfirmUnlink={unlinkPartner}
      />
    </div>
  );
};
