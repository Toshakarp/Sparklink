import { useState } from 'react';
import { LoginPage, MainPage, DatesPage, SettingsPage } from '@/pages';
import { BottomNavigation, type NavigationTab } from '@/widgets/navigation';


import { useUserStore } from '@/entities/user';

import styles from './App.module.scss';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavigationTab>('main');
  const isAuth = useUserStore((state) => state.isAuth);

  if (!isAuth) {
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

