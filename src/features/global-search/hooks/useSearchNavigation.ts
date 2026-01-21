import { useRouter } from 'next/navigation';

import { useIsAdmin } from '@/services';

import { type ISearchResult } from '../types/types';

export const useSearchNavigation = () => {
  const router = useRouter();
  const { isAdmin, isLoading } = useIsAdmin();

  const navigate = (item: ISearchResult) => {
    if (!item.requestId || isLoading) {
      return;
    }

    router.push(
      isAdmin
        ? `/requests/${item.requestId}`
        : `/requests-history?requestId=${item.requestId}`,
    );
  };

  return navigate;
};
