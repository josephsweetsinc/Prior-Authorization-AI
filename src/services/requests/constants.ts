import { type AuthorizationRequestsDateFilter } from './types';

export const DATE_VALUE_MAP: Record<
  AuthorizationRequestsDateFilter,
  number | undefined
> = {
  all: undefined,
  today: 0,
  '7-days': 7,
  '30-days': 30,
  '90-days': 90,
  year: 365,
};
