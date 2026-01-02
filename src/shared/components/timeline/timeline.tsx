'use client';

import { CircleX } from 'lucide-react';

import { SuccessFilledIcon } from '@/shared/assets/icons';
import { cn } from '@/shared/lib/utils';
export type RequestStatus = 'approved' | 'pending' | 'processing' | 'denied';

interface TimelineItem {
  title: string;
  date?: string;
  description?: string;
  status: RequestStatus;
}

interface StatusTimelineProps {
  items: TimelineItem[];
}

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
              item.status === 'approved' && 'bg-[#24B2001A]',
              item.status === 'pending' && 'bg-[#24B2001A]',
              item.status === 'processing' && 'bg-[#24B2001A]',
              item.status === 'denied' && 'bg-[#FC2A001A]',
            )}
          >
            {item.status === 'denied' ? (
              <CircleX size={20} color='#FE5C73' strokeWidth={1.25} />
            ) : (
              <SuccessFilledIcon />
            )}
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
