import { useState, useEffect } from 'react';
import { LoginPage, MainPage, DatesPage, SettingsPage } from '@/pages';
import { BottomNavigation, type NavigationTab } from '@/widgets/navigation';
import { initDevEnvironment, initializeTelegram, tgService } from '@/shared/lib';
import { useInitStore } from '@/app/model/useInitStore';
import { useUserStore } from '@/entities/user';
import { usePairStore } from '@/entities/pair';
import { useMoodStore } from '@/entities/mood';
import { usePlaceStore } from '@/entities/place';
import { useWishTagsStore } from '@/entities/mood';
import styles from './App.module.scss';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavigationTab>('main');
  const { status, initialize } = useInitStore();
  const isAuth = useUserStore((state) => state.isAuth);
  const currentUser = useUserStore((state) => state.currentUser);
  const partnerUser = usePairStore((state) => state.partnerUser);

  useEffect(() => {
    initDevEnvironment().then(() => {
      initializeTelegram();
      tgService.ready();
      tgService.expand();
      initialize(); // Запуск проверки окружения  useInitStore
    });
  }, [initialize]);

  useEffect(() => {
    if ((status === 'telegram_ready' || status === 'browser_mock') && isAuth && currentUser?.pairId) {
      const pairId = currentUser.pairId;
      const userId = currentUser.id;

      // Загружаем данные партнера, список мест и теги желаний
      usePairStore.getState().fetchPartner(pairId, userId);
      usePlaceStore.getState().fetchPlacesData(pairId);
      useWishTagsStore.getState().fetchTags(pairId);
    }
  }, [status, isAuth, currentUser?.pairId, currentUser?.id]);

  // Синхронизация модели настроения при изменении данных пользователей
  useEffect(() => {
    if (currentUser) {
      useMoodStore.getState().fetchMoods(currentUser, partnerUser);
    }
  }, [currentUser, partnerUser]);


  if (status === 'checking') {
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

