import { type RequestStatus } from '@/services/dashboard';

export type TimelineStatus = 'approved' | 'pending' | 'submitted' | 'denied';

export const TIMELINE_STATUS_MAP: Record<RequestStatus, TimelineStatus> = {
  approved: 'approved',
  pending: 'pending',
  draft: 'pending',
  submitted: 'submitted',
  denied: 'denied',
};

export const STATUS_LABELS: Record<RequestStatus, string> = {
  approved: 'Approved',
  pending: 'Pending',
  draft: 'Draft',
  submitted: 'Submitted',
  denied: 'Denied',
};

export const AMBULATORY_STATUS_OPTIONS: { label: string; value: string }[] = [
  { label: 'Ambulatory', value: 'ambulatory' },
  { label: 'Non-Ambulatory', value: 'non-ambulatory' },
];
