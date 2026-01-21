import type { ISearchResultGroup } from './types/types';

export const DEBOUNCE_DELAY_MS = 250;

export const FALLBACK_RESULTS: ISearchResultGroup[] = [
  {
    title: 'Conditions',
    items: [
      {
        id: 'condition-1',
        title: "Chronic Parkinson's disease",
        subtitle: 'James Willson',
      },
      {
        id: 'condition-2',
        title: 'Chronic COPD with oxygen dependence',
        subtitle: 'Robert Martinez',
      },
    ],
  },
  {
    title: 'Requests',
    items: [
      {
        id: 'request-1',
        title: 'Chronic heart failure, mobility impaired',
        subtitle: 'Mary Thompson',
      },
    ],
  },
];
