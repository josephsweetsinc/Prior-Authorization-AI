import { type RequestStatus } from '../dashboard';

export const STATUS_CHART_CONFIG: Record<
  RequestStatus,
  { label: string; color: string }
> = {
  approved: {
    label: 'Approved',
    color: '#24B200',
  },
  draft: {
    label: 'Pending',
    color: '#FACC15',
  },
  submitted: {
    label: 'Submitted',
    color: '#4C00FE',
  },
  pending: {
    label: 'Pending',
    color: '#047CB4',
  },
  denied: {
    label: 'Denied',
    color: '#FE5C73',
  },
};

export const ACTION_STATUS_TITLE: Record<RequestStatus, string> = {
  approved: 'Approved request',
  draft: 'Created a draft',
  submitted: 'Submitted a request',
  pending: 'Reviewed a request',
  denied: 'Denied request',
};
