import { useGetCurrentUserQuery } from '../api';

export const useIsAdmin = () => {
  const { data: currentUser, isLoading } = useGetCurrentUserQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const isAdmin = currentUser?.role === 'admin';

  return { isAdmin, isLoading };
};
