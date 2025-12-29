import { type NewRequestState } from '@/features/new-request';
import { type RootState } from '@/store';

export const selectNewRequest = (s: RootState) =>
  s.newRequest as NewRequestState | undefined;
