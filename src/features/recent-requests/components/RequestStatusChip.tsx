import { type RequestStatus } from '@/services/dashboard';
import { Chip } from '@/shared/components';

const STATUS_CONFIG = {
  approved: { label: 'Approved', variant: 'success' },
  pending_review: { label: 'Pending Review', variant: 'warning' },
  denied: { label: 'Denied', variant: 'destructive' },
} as const;

export const RequestStatusChip = ({ status }: { status: RequestStatus }) => {
  const config = STATUS_CONFIG[status];

  if (!config) {
    return <Chip size='sm' variant='warning' label='Unknown' />;
  }

  return <Chip size='sm' {...config} />;
};
