export interface IRoleOptions {
  role: 'provider' | 'admin' | 'all';
}

export interface IFilters extends IRoleOptions {
  searchQuery: string;
}

export interface IFormData {
  role: 'admin' | 'provider';
  fullName: string;
  email: string;
}
