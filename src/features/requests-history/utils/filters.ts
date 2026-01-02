import { type IRequest } from '@/services/requests-history';

import { DAY_MS } from '../constants';

export const filterByStatus = (requests: IRequest[], status?: string) => {
  if (!status || status === 'all') {
    return requests;
  }

  return requests.filter((r) => r.status === status);
};

export const filterByDate = (requests: IRequest[], dateRange?: string) => {
  if (!dateRange || dateRange === 'all') {
    return requests;
  }

  const now = new Date();

  return requests.filter((r) => {
    const created = new Date(r.created_at);

    switch (dateRange) {
      case 'today':
        return created.toDateString() === now.toDateString();
      case '7-days':
        return created >= new Date(now.getTime() - 7 * DAY_MS);
      case '30-days':
        return created >= new Date(now.getTime() - 30 * DAY_MS);
      case '90-days':
        return created >= new Date(now.getTime() - 90 * DAY_MS);
      case 'year':
        return created.getFullYear() === now.getFullYear();
      default:
        return true;
    }
  });
};

export const filterByQuery = (requests: IRequest[], query?: string) => {
  if (!query) {
    return requests;
  }

  const q = query.toLowerCase();

  return requests.filter(
    (request) =>
      request.patient_first_name.toLowerCase().includes(q) ||
      request.patient_last_name.toLowerCase().includes(q) ||
      request.id.toString().includes(q),
  );
};
