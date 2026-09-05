import type { IPairApi } from '../../core/pair.api';
import type { UserMoodTagDTO } from '../../types/models';
import { mockPartnerUserDTO } from '../data/user.mock';
import { mockDateTagsDTO, mockMoodTagsDTO, mockBudgetTiersDTO } from '../data/tags.mock';

export const createMockPairApi = (): IPairApi => {
  const partnerUser = { ...mockPartnerUserDTO };
  let selectedTags: UserMoodTagDTO[] = [
    // Pre-select 'hug' for partner in mock/demo mode so the partner indicator is immediately visible
    { userId: partnerUser.id, tagId: 'hug', pairId: 'mock-pair-id' },
  ];

  return {
    getPartner: async () => {
      await new Promise((resolve) => setTimeout(resolve, 200));
      return partnerUser;
    },

    getPairData: async () => {
      await new Promise((resolve) => setTimeout(resolve, 200));
      return {
        placeCategories: mockDateTagsDTO,
        moodTags: mockMoodTagsDTO,
        budgetTiers: mockBudgetTiersDTO,
      };
    },

    createPairWithInvite: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const pairId = 'mock-pair-id';
      partnerUser.pairId = pairId;
      return { pairId, partner: partnerUser };
    },

    getSelectedMoodTags: async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return [...selectedTags];
    },

    toggleUserMoodTag: async (
      userId: string,
      pairId: string,
      tagId: string,
      isSelected: boolean
    ) => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      if (isSelected) {
        if (!selectedTags.some((t) => t.userId === userId && t.tagId === tagId)) {
          selectedTags.push({ userId, tagId, pairId });
        }
      } else {
        selectedTags = selectedTags.filter(
          (t) => !(t.userId === userId && t.tagId === tagId)
        );
      }
    },
  };
};
