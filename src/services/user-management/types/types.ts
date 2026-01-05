import { type IUser } from '@/services/auth';

export interface IUserEntry extends Omit<IUser, 'name' | 'surname'> {
  full_name: string;
  last_login: string;
}

export interface IGetUsersResponse {
  items: IUserEntry[];
  page: number;
  total: number;
  showing: number;
  total_pages: number;
}
