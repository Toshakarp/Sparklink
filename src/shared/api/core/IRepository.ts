import type { UserDTO, PlaceDTO, TagDTO, BudgetTierDTO } from '../mock/types';


export interface DateCategoryDTO {
  id: string;
  pair_id?: string;
  label: string;
  emoji: string;
}

export interface PairData {
  places: PlaceDTO[];
  placeCategories: DateCategoryDTO[];
  moodTags: TagDTO[];
  budgetTiers: BudgetTierDTO[];
}

export interface IRepository {
  // есть ли пользователь в базе по его Telegram ID
  getUserByTelegramId(telegramId: string): Promise<UserDTO | null>;

  // Создает или обновляет пользователя при входе в Tg
  upsertUser?(userData: { telegramId: string; firstName: string; photoUrl?: string | null; themeColor?: string }): Promise<UserDTO>;

  // Получает партнера для текущего юзера по ID пары 
  getPartner(pairId: string, currentUserId: string): Promise<UserDTO | null>;

  // Получает все списки, специфичные для пары (категории, места, теги, бюджеты)
  getPairData(pairId: string): Promise<PairData>;

  // Обновляет настроение и уровень энергии текущего пользователя
  updateUserMood(userId: string | number, energy: number, moodId?: string): Promise<void>;

  // Обновляет фото виджета LockIt
  updateLockitPhoto(userId: string | number, photoUrl: string | null): Promise<void>;

  // Связывает двух пользователей в пару по ссылке-приглашению (deep link) 
  createPairWithInvite?(inviterTelegramIdOrId: string, currentUserId: string | number): Promise<{ pairId: string; partner: UserDTO | null }>;
}

