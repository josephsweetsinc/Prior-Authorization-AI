import type { IUser } from '@/services/auth/types';

const FALLBACK_VALUE = '—';

export const getFullName = (user?: IUser) =>
  [user?.name, user?.surname].filter(Boolean).join(' ');

export const getDisplayName = (user?: IUser) => {
  const fullName = getFullName(user);
  return fullName || user?.email || FALLBACK_VALUE;
};

export const getRoleLabel = (user?: IUser) =>
  user?.role
    ? `${user.role[0].toUpperCase()}${user.role.slice(1)}`
    : FALLBACK_VALUE;

export const getProfileRole = (user?: IUser) =>
  user?.role === 'provider'
    ? user?.position || FALLBACK_VALUE
    : getRoleLabel(user);
