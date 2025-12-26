import { type RequestStatus } from '../dashboard';

export const REQUEST_STATUS_CONFIG: Record<
  RequestStatus,
  { label: string; color: string }
> = {
  approved: {
    label: 'Approved',
    color: '#22c55e',
  },
  pending: {
    label: 'Pending',
    color: '#eab308',
  },
  processing: {
    label: 'Processing',
    color: '#3b82f6',
  },
  denied: {
    label: 'Denied',
    color: '#ef4444',
  },
};
