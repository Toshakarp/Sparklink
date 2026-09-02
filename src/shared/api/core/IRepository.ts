import type { UserDTO, PlaceDTO, CreatePlaceDTO, TagDTO, BudgetTierDTO } from '../mock/types';

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
  getUserByTelegramId(telegramId: string): Promise<UserDTO | null>;

  upsertUser?(userData: { telegramId: string; firstName: string; photoUrl?: string | null; themeColor?: string }): Promise<UserDTO>;

  getPartner(pairId: string, currentUserId: string): Promise<UserDTO | null>;

  getPairData(pairId: string): Promise<PairData>;

  updateUserMood(userId: string | number, energy: number, moodId?: string): Promise<void>;

  updateLockitPhoto(userId: string | number, photoUrl: string | null): Promise<void>;

  createPlace?(pairId: string, place: CreatePlaceDTO): Promise<PlaceDTO>;

  updatePlace?(place: PlaceDTO): Promise<void>;

  deletePlace?(placeId: string): Promise<void>;

  createPairWithInvite?(inviterTelegramIdOrId: string, currentUserId: string | number): Promise<{ pairId: string; partner: UserDTO | null }>;
}

