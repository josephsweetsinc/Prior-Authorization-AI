import { Check, X } from 'lucide-react';

import { type RequestStatus } from '@/services/dashboard';
import { cn } from '@/shared/lib/utils';

export const StatusIcon = ({ status }: { status: RequestStatus }) => {
  const styles: Record<RequestStatus, string> = {
    approved: 'bg-status-success/10 text-status-success',
    pending: 'bg-status-success/10 text-status-success',
    draft: 'bg-status-warning/10 text-status-warning',
    submitted: 'bg-indigo-100 text-indigo-500',
    denied: 'bg-status-destructive/10 text-status-destructive',
  };

  return (
    <div
      className={cn(
        'flex h-6 w-6 items-center justify-center rounded-full',
        styles[status],
      )}
    >
      {status === 'denied' ? (
        <X className='size-4' />
      ) : (
        <Check className='size-4' />
      )}
    </div>
  );
};
