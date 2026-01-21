import { useSearchRequestsByPatientQuery } from '@/services/requests';

import { FALLBACK_RESULTS } from '../constants';
import { type ISearchResultGroup } from '../types/types';
import { buildSearchPayload, buildSearchResults } from '../utils/builders';

export const useGlobalSearchResults = (
  query: string,
  providedResults?: ISearchResultGroup[],
) => {
  const shouldUseQuery = providedResults === undefined;
  const shouldSkip = !shouldUseQuery || query.length === 0;

  const { data, isFetching } = useSearchRequestsByPatientQuery(
    buildSearchPayload(query),
    { skip: shouldSkip },
  );

  const fetchedResults = buildSearchResults(data?.request_ids);

  let results = [];

  if (providedResults) {
    results = providedResults;
  } else if (shouldUseQuery) {
    results = fetchedResults;
  } else {
    results = FALLBACK_RESULTS;
  }

  return {
    results,
    isSearching: isFetching,
  };
};
