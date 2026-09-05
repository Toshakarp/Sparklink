import { createMockUserApi, createMockPlacesApi, createMockPairApi } from '@/shared/api/mock';
import type { UserDTO } from '@/shared/api/types/models';

export const createMockApiSuite = (userData?: Partial<UserDTO>) => {
  const userApi = createMockUserApi(userData);
  const placesApi = createMockPlacesApi();
  const pairApi = createMockPairApi();

  return { userApi, placesApi, pairApi };
};
