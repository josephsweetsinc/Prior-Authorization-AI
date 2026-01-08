import { format, parse } from 'date-fns';

import { type RequestStatus } from '@/services/dashboard';

export type TimelineStatus = 'approved' | 'pending' | 'processing' | 'denied';

export const TIMELINE_STATUS_MAP: Record<RequestStatus, TimelineStatus> = {
  approved: 'approved',
  pending: 'pending',
  draft: 'pending',
  submitted: 'processing',
  denied: 'denied',
};

export const STATUS_LABELS: Record<RequestStatus, string> = {
  approved: 'Approved',
  pending: 'Pending',
  draft: 'Draft',
  submitted: 'Submitted',
  denied: 'Denied',
};

export const displayValue = (value?: string | number | null) => {
  if (value === null || value === undefined || value === '') {
    return 'Not provided';
  }

  return String(value);
};

export const formatDate = (value?: string | null) => {
  if (!value) {
    return 'Not provided';
  }

  return format(new Date(value), 'MM/dd/yyyy');
};

export const formatTime = (value?: string | null) => {
  if (!value) {
    return 'Not provided';
  }

  const parsed = parse(value, 'HH:mm:ss', new Date());
  return format(parsed, 'hh:mm a');
};
