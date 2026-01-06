import { type RequestStatus } from '@/services/dashboard';

export interface IFilters {
  searchQuery: string;
  status: 'all' | RequestStatus;
  date: string;
}
