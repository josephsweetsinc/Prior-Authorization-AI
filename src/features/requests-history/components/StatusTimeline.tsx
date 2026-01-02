import { format } from 'date-fns';

import { type IStatus } from '@/services';
import { cn } from '@/shared/lib/utils';

import { StatusIcon } from './StatusIcon';

interface TimelineProps {
  history: IStatus[];
  className?: string;
}

export const StatusTimeline = ({ history, className }: TimelineProps) => {
  return (
    <div className={cn('space-y-5', className)}>
      <h2 className='text-brand-dark text-base font-bold md:text-lg xl:text-xl'>
        Status timeline
      </h2>
      {history.map((requestState, index) => {
        const isLast = index === history.length - 1;

        return (
          <div key={index} className='relative flex h-min gap-5'>
            {!isLast && (
              <div className='bg-muted-blue absolute top-7.75 left-3 h-2/3 w-px -translate-x-1/2' />
            )}
            <StatusIcon status={requestState.status} />

            <div className='space-y-1'>
              <p className='text-foreground text-xs leading-none font-bold capitalize md:text-sm lg:text-base'>
                {requestState.status}
              </p>

              <time
                dateTime={requestState.created_at}
                className='text-muted-blue text-xs leading-none md:text-sm'
              >
                {format(
                  new Date(requestState.created_at),
                  "MMM d, yyyy 'at' h:mm a",
                )}
              </time>

              {requestState.notes && (
                <p className='text-muted-blue text-xs md:text-sm'>
                  {requestState.notes}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
