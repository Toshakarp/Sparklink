/* eslint-disable @typescript-eslint/no-explicit-any */
import { 
  init, 
  miniApp, 
  initData, 
  hapticFeedback, 
  isTMA, 
  viewport, 
  mockTelegramEnv 
} from '@tma.js/sdk';

import type { ITelegramPort, TelegramUser } from './ITelegramPort';
export type { TelegramUser };

export const mockTelegramUser: TelegramUser = {
  id: '10001',
  first_name: 'dev',
  last_name: 'devovich',
  username: 'devvv',
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

export class TelegramAdapter implements ITelegramPort {
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
          id: String(rawUser.id),
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
          id: String(user.id),
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

  public openTelegramLink(url: string): void {
    try {
      if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp?.openTelegramLink) {
        (window as any).Telegram.WebApp.openTelegramLink(url);
        return;
      }
      window.open(url, '_blank');
    } catch {
      window.open(url, '_blank');
    }
  }

  public getStartParam(): string | null {
    try {
      const rawInitData = this.getInitData();
      if (rawInitData) {
        const params = new URLSearchParams(rawInitData);
        const param = params.get('start_param');
        if (param) return param;
      }
      return (window as any).Telegram?.WebApp?.initDataUnsafe?.start_param || null;
    } catch {
      return null;
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

export const tgService = new TelegramAdapter();
