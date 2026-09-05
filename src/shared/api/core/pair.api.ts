import type {
  UserDTO,
  DateCategoryDTO,
  TagDTO,
  BudgetTierDTO,
  UserMoodTagDTO,
} from '../types/models';

export interface IPairData {
  placeCategories: DateCategoryDTO[];
  moodTags: TagDTO[];
  budgetTiers: BudgetTierDTO[];
}

export interface IPairApi {
  getPartner(pairId: string, currentUserId: string): Promise<UserDTO | null>;
  getPairData(pairId: string): Promise<IPairData>;
  createPairWithInvite(
    inviterParam: string,
    currentUserId: string
  ): Promise<{ pairId: string; partner: UserDTO | null }>;
  getSelectedMoodTags(pairId: string): Promise<UserMoodTagDTO[]>;
  toggleUserMoodTag(
    userId: string,
    pairId: string,
    tagId: string,
    isSelected: boolean
  ): Promise<void>;
}
