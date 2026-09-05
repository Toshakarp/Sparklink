import type { UserDTO } from "../../types/models";
import { mockPartnerUserDTO } from './user.mock';

export interface PairDTO {
  id: string;
  partner?: UserDTO;
}

export const mockPairDTO: PairDTO = {
  id: 'pair-10001-10002',
  partner: mockPartnerUserDTO,
};
