import { type RootState } from '@/store';

export const selectNewRequest = (s: RootState) => s.newRequest;
