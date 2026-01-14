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
      className={cn('relative z-20 row-span-1 mx-10 mt-9', className)}
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
