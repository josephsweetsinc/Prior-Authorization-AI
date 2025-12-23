import { forwardRef, type HTMLProps } from 'react';

import { cn } from '@/shared/lib/utils';

export type HeaderProps = HTMLProps<HTMLElement>;

export type HeaderSlotProps = HTMLProps<HTMLDivElement>;

const Header = forwardRef<HTMLElement, HeaderProps>(
  ({ className, children, ...props }, ref) => (
    <header
      className={cn('flex items-center justify-between gap-8', className)}
      ref={ref}
      {...props}
    >
      {children}
    </header>
  ),
);

Header.displayName = 'Header';

const HeaderActions = forwardRef<HTMLDivElement, HeaderSlotProps>(
  ({ className, ...props }, ref) => (
    <div
      className={cn('flex items-center gap-3 justify-self-end', className)}
      ref={ref}
      {...props}
    />
  ),
);

HeaderActions.displayName = 'HeaderActions';

export { Header, HeaderActions };
