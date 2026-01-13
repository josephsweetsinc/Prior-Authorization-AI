import { type HTMLProps } from 'react';

import LogoIcon from '@/shared/assets/icons/logo';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from '@/shared/components';
import { cn } from '@/shared/lib/utils';

const SkeletonItem = () => (
  <div className='flex items-center gap-3 px-3 py-2'>
    <div className='bg-muted h-5 w-5 animate-pulse rounded' />
    <div className='bg-muted h-4 w-28 animate-pulse rounded' />
  </div>
);

export const SidebarSkeleton = ({
  className,
  ...props
}: HTMLProps<HTMLElement>) => {
  return (
    <Sidebar className={cn('row-span-2', className)} {...props}>
      <SidebarHeader className='flex items-center'>
        <LogoIcon />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup aria-label='Main Navigation'>
          <SkeletonItem />
          <SkeletonItem />
          <SkeletonItem />
          <SkeletonItem />
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className='space-y-2 rounded-xl border p-4'>
          <div className='bg-muted h-4 w-32 animate-pulse rounded' />
          <div className='bg-muted h-3 w-full animate-pulse rounded' />
          <div className='bg-muted mt-3 h-8 w-24 animate-pulse rounded' />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};
