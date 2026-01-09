export type RoleOptions = 'provider' | 'admin' | 'all';

export interface IFilters {
  searchQuery: string;
  role: RoleOptions;
}

export interface ICreateFormData {
  role: 'admin' | 'provider';
  fullName: string;
  email: string;
  password: string;
}

export interface IUpdateFormData {
  role: 'admin' | 'provider';
  name: string;
  surname: string;
  email: string;
}

export interface ApiError {
  data?: {
    detail?: string;
  };
  status?: number;
}
