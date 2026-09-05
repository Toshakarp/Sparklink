export interface TelegramUser {
  id: string;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  photo_url?: string;
}

export interface ITelegramPort {
  isAvailable(): Promise<boolean>;
  getInitData(): string;
  getTelegramUser(): TelegramUser | null;
  ready(): void;
  expand(): void;
  close(): void;
  openTelegramLink(url: string): void;
  getStartParam(): string | null;
  haptic(type: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error'): void;
}
