import { forwardRef, type HTMLProps } from 'react';

import LogoIcon from '@/shared/assets/icons/logo';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  Skeleton,
} from '@/shared/components';
import { cn } from '@/shared/lib/utils';

const SkeletonItem = () => (
  <div className='flex items-center gap-3 px-3 py-2'>
    <div className='bg-muted h-5 w-5 animate-pulse rounded' />
    <div className='bg-muted h-4 w-28 animate-pulse rounded' />
  </div>
);

export type SidebarCTASkeletonProps = HTMLProps<HTMLDivElement> & {
  withIcon?: boolean;
};

export const SidebarCTASkeleton = forwardRef<
  HTMLDivElement,
  SidebarCTASkeletonProps
>(({ className, withIcon = false, ...props }, ref) => {
  return (
    <article
      ref={ref}
      className={cn(
        'relative flex flex-col items-center rounded-[24px] border px-6 py-4.25 text-center',
        { 'pt-14.25': withIcon },
        className,
      )}
      {...props}
    >
      {withIcon && (
        <div className='absolute inset-x-1/2 top-0 flex aspect-square w-23.5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-[5px] border-white bg-neutral-50'>
          <Skeleton className='size-10 rounded-full bg-neutral-200/50' />
        </div>
      )}

      <Skeleton className='mb-2 h-6 w-32' />

      <Skeleton className='mb-2 h-4 w-full max-w-50' />
      <Skeleton className='mb-4 h-4 w-5/6 max-w-50' />

      <Skeleton className='h-9 w-full rounded-full' />
    </article>
  );
});

SidebarCTASkeleton.displayName = 'SidebarCTASkeleton';

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
        <SidebarCTASkeleton withIcon />
      </SidebarFooter>
    </Sidebar>
  );
};
