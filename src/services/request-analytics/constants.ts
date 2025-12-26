import { type RequestStatus } from '../dashboard';

export const STATUS_CHART_CONFIG: Record<
  RequestStatus,
  { label: string; color: string }
> = {
  approved: {
    label: 'Approved',
    color: '#2FB400',
  },
  pending: {
    label: 'Pending',
    color: '#FACC15',
  },
  processing: {
    label: 'Processing',
    color: '#3B82F6',
  },
  denied: {
    label: 'Denied',
    color: '#EF4444',
  },
};
