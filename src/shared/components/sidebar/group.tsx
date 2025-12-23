import { type HTMLProps, forwardRef } from 'react';

import { cn } from '@/shared/lib/utils';

export type SidebarGroupProps = HTMLProps<HTMLDivElement>;

export const SidebarGroup = forwardRef<HTMLDivElement, SidebarGroupProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <nav ref={ref} className={cn('mb-4 space-y-6', className)} {...props}>
        {children}
      </nav>
    );
  },
);

SidebarGroup.displayName = 'SidebarGroup';
