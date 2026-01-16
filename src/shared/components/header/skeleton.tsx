'use client';

import { type HTMLProps } from 'react';

import {
  Header,
  HeaderActions,
  HeaderGroup,
  Skeleton,
} from '@/shared/components';
import { cn } from '@/shared/lib/utils';

type Props = HTMLProps<HTMLElement>;

export const HeaderSkeleton = ({ className, ...props }: Props) => {
  return (
    <Header
      className={cn(
        'bg-header-background sticky top-0 z-20 px-10 pt-8 pb-2.5 backdrop-blur-lg',
        className,
      )}
      {...props}
    >
      <Skeleton className='h-10 w-105 rounded-lg bg-white' />

      <HeaderGroup separate>
        <HeaderActions>
          <Skeleton className='h-10 w-10 rounded-full bg-white' />
          <Skeleton className='h-10 w-10 rounded-full bg-white' />
        </HeaderActions>

        <div className='flex items-center gap-3'>
          <Skeleton className='h-10 w-10 rounded-full bg-white' />
          <div className='space-y-1'>
            <Skeleton className='h-3 w-28 rounded-md bg-white' />
            <Skeleton className='h-3 w-20 rounded-md bg-white' />
          </div>
        </div>
      </HeaderGroup>
    </Header>
  );
};
