'use client';

import {
  CircleX,
  ClockFading,
  FileCheckCorner,
  CircleCheck,
} from 'lucide-react';

import { type RequestStatus } from '@/services/dashboard';
import { cn } from '@/shared/lib/utils';

interface TimelineItem {
  title: string;
  date?: string;
  description?: string;
  status: RequestStatus;
}

interface StatusTimelineProps {
  items: TimelineItem[];
}

const StatusTimelineIcon = ({ status }: { status: RequestStatus }) => {
  if (status === 'denied') {
    return <CircleX size={14} color='#FE5C73' strokeWidth={1.25} />;
  }

  if (status === 'pending') {
    return <ClockFading size={14} color='#F59E0B' strokeWidth={1.25} />;
  }

  if (status === 'approved') {
    return <FileCheckCorner size={14} color='#24B200' strokeWidth={1.25} />;
  }

  return <CircleCheck size={14} color='#4C00FE' strokeWidth={1.25} />;
};

export function StatusTimeline({ items }: StatusTimelineProps) {
  return (
    <div className='relative space-y-6'>
      {items.map((item, index) => (
        <div key={index} className='relative flex gap-4'>
          {index !== items.length - 1 && (
            <div className='bg-muted-foreground/30 absolute top-10 left-4 h-[60%] w-px' />
          )}
          <div
            className={cn(
              'flex h-7.5 w-7.5 items-center justify-center rounded-full',
              item.status === 'submitted' && 'bg-[#4C00FE1A]',
              item.status === 'pending' && 'bg-[#FC9D001A]',
              item.status === 'denied' && 'bg-[#FC2A001A]',
              item.status === 'approved' && 'bg-[#24B2001A]',
            )}
          >
            <StatusTimelineIcon status={item.status} />
          </div>

          <div className='flex flex-col gap-1 pb-4'>
            <span className={cn('text-sm font-semibold', 'text-foreground')}>
              {item.title}
            </span>

            {item.date && (
              <span className='text-muted-foreground text-sm'>{item.date}</span>
            )}

            {item.description && (
              <span className='text-muted-foreground text-sm'>
                {item.description}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
