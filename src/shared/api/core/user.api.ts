import type { UserDTO } from '../types/models';

export interface IUserApi {
  getUserByTelegramId(telegramId: string): Promise<UserDTO | null>;
  upsertUser(userData: {
    telegramId: string;
    firstName: string;
    photoUrl?: string | null;
    themeColor?: string;
    initDataRaw?: string;
  }): Promise<UserDTO>;
  updateUserMood(userId: string | number, energy: number, moodId?: string): Promise<void>;
  updateLockitPhoto(userId: string | number, photoUrl: string | null): Promise<void>;
  updateThemeColor(userId: string, color: string): Promise<void>
}
