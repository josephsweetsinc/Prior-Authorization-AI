import { useGetCurrentUserQuery } from '@/services/auth';

export const useIsAdmin = () => {
  const { data: currentUser } = useGetCurrentUserQuery();
  return currentUser?.role === 'admin';
};
