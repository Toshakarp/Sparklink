import type { User } from '@/entities/user/model/types';

export interface Pair {
  id: string;
  createdAt?: Date;
  
  partner?: User;
}
