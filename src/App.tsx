import { useMoodStore } from '@/entities/mood';
import { useState, useEffect } from 'react';
import { LoginPage, MainPage, DatesPage, SettingsPage } from '@/pages';
import { BottomNavigation, type NavigationTab } from '@/widgets/navigation';
import { useDataSync } from '@/features/sync';
import { useUserStore } from '@/entities/user';
import { usePairStore } from '@/entities/pair';
import styles from './App.module.scss';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavigationTab>('main');
  const { status } = useDataSync();
  const isAuth = useUserStore((state) => state.isAuth);
  const currentUser = useUserStore((state) => state.currentUser);
  const partnerUser = usePairStore((state) => state.partnerUser);

  useEffect(() => {
    useMoodStore.getState().fetchMoods(currentUser, partnerUser);
  }, [currentUser, partnerUser]);

  const isDataLoading = status !== 'checking' && isAuth && !!currentUser?.pairId && !partnerUser;

  if (status === 'checking' || isDataLoading) {
    return (
      <div 
         className={styles.appContainer} 
         style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}
      >
        Загрузка...
      </div>
    );
  }

  if (status === 'telegram_no_pair' || !isAuth) {
    return <LoginPage />;
  }

  return (
    <div className={styles.appContainer}>
      <main className={styles.mainScrollArea}>
        {activeTab === 'main' && <MainPage onOpenSettings={() => setActiveTab('settings')} />}
        {activeTab === 'dates' && <DatesPage />}
        {activeTab === 'settings' && <SettingsPage />}
      </main>
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
