import { 
  init, 
  miniApp, 
  initData, 
  hapticFeedback, 
  isTMA, 
  viewport, 
  mockTelegramEnv 
} from '@tma.js/sdk';

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  photo_url?: string;
}

export const mockTelegramUser: TelegramUser = {
  id: 10001,
  first_name: 'Алекс',
  last_name: 'Иванов',
  username: 'alex_dev',
  language_code: 'ru',
  photo_url: undefined,
};

export async function initDevEnvironment(): Promise<void> {
  if (import.meta.env?.DEV) {
    try {
      const inTMA = await isTMA();
      if (!inTMA) {
        const initDataRaw = new URLSearchParams([
          ['user', JSON.stringify(mockTelegramUser)],
          ['hash', 'hash'],
          ['auth_date', '24062006'],
          ['signature', 'fsignature'],
        ]).toString();

        mockTelegramEnv({
          launchParams: {
            tgWebAppData: initDataRaw,
            tgWebAppVersion: '8.0',
            tgWebAppPlatform: 'tdesktop',
          } as any,
        });
      }
    } catch {
      // ignore in environments without window/TMA
    }
  }
}

export function initializeTelegram(): void {
  try {
    init();
  } catch (error) {
    console.error('Telegram init error:', error);
  }
}

class TelegramService {
  public async isAvailable(): Promise<boolean> {
    try {
      return await isTMA();
    } catch {
      return false;
    }
  }

  public ready(): void {
    try {
      if (miniApp.ready.isAvailable()) {
        miniApp.ready();
      }
    } catch {
      // ignore
    }
  }

  public expand(): void {
    try {
      if (viewport.expand.isAvailable()) {
        viewport.expand();
      }
    } catch {
      // ignore
    }
  }

  public getInitData(): string {
    try {
      return initData.raw() || '';
    } catch {
      return '';
    }
  }

  public getTelegramUser(): TelegramUser | null {
    try {
      const rawUser = (window as any).Telegram?.WebApp?.initDataUnsafe?.user;
      if (rawUser) {
        return {
          id: rawUser.id,
          first_name: rawUser.first_name,
          last_name: rawUser.last_name,
          username: rawUser.username,
          language_code: rawUser.language_code,
          photo_url: rawUser.photo_url,
        };
      }

      const user = initData.user();
      if (user) {
        return {
          id: user.id,
          first_name: (user as any).firstName || (user as any).first_name,
          last_name: (user as any).lastName || (user as any).last_name,
          username: user.username,
          language_code: (user as any).languageCode || (user as any).language_code,
          photo_url: (user as any).photoUrl || (user as any).photo_url,
        };
      }
      return null;
    } catch {
      return null;
    }
  }

  public close(): void {
    try {
      if (miniApp.close.isAvailable()) {
        miniApp.close();
        return;
      }
    } catch {
      // ignore
    }
    try {
      (window as any).Telegram?.WebApp?.close?.();
    } catch {
      // ignore
    }
  }

  public haptic(type: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error'): void {
    try {
      if (!hapticFeedback.isSupported()) return;

      if (['success', 'warning', 'error'].includes(type)) {
        hapticFeedback.notificationOccurred(type as 'success' | 'warning' | 'error');
      } else {
        hapticFeedback.impactOccurred(type as 'light' | 'medium' | 'heavy');
      }
    } catch {
      // ignore in non-touch/desktop browsers
    }
  }
}

export const tgService = new TelegramService();
