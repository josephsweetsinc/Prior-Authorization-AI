import * as React from 'react';

import { cn } from '@/shared/lib/utils';

export type SidebarProps = React.HTMLProps<HTMLElement>;
export type SidebarSectionProps = React.HTMLProps<HTMLElement>;

export const Sidebar = React.forwardRef<HTMLElement, SidebarProps>(
  ({ className, ...props }, ref) => (
    <aside
      ref={ref}
      className={cn(
        'bg-sidebar text-sidebar-foreground flex h-screen max-w-[20.137%] min-w-72.5 flex-col',
        className,
      )}
      {...props}
    />
  ),
);

Sidebar.displayName = 'Sidebar';

export const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  SidebarSectionProps
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('border-b px-8 pt-9.75 pb-6.75', className)}
    {...props}
  />
));
SidebarHeader.displayName = 'SidebarHeader';

export const SidebarContent = React.forwardRef<
  HTMLDivElement,
  SidebarSectionProps
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('bg-red flex-1 overflow-y-auto py-10 pl-8', className)}
    {...props}
  />
));

SidebarContent.displayName = 'SidebarContent';

export const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  SidebarSectionProps
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('px-8 py-10', className)} {...props} />
));

SidebarFooter.displayName = 'SidebarFooter';
