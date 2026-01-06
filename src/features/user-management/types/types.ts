export type RoleOptions = 'provider' | 'admin' | 'all';

export interface IFilters {
  searchQuery: string;
  role: RoleOptions;
}

export interface IFormData {
  role: 'admin' | 'provider';
  fullName: string;
  email: string;
}

export interface ICreateFormData extends IFormData {
  password: string;
}

export interface ApiError {
  data?: {
    detail?: string;
  };
  status?: number;
}
