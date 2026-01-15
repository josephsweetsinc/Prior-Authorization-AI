import { type UserRoles, type IUser } from '@/services/auth';

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

export interface ICreateUserPayload {
  name: string;
  surname: string;
  password: string;
  role: UserRoles;
  email: string;
}

export interface IUpdateUserPayload {
  name: string;
  surname: string;
  email: string;
}

export interface IGetUserParams {
  page?: number;
  search?: string;
  role?: string;
}
