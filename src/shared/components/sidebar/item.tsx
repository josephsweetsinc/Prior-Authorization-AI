'use client';

import { icons } from 'lucide-react';
import Link, { type LinkProps } from 'next/link';
import { usePathname } from 'next/navigation';
import { type HTMLProps, forwardRef } from 'react';

import { cn } from '@/shared/lib/utils';

export type Props = {
  /** Text label for the navigation item */
  label: string;
  /** Path or href to navigate to */
  to: LinkProps['href'];
  /** Optional icon element */
  icon?: keyof typeof icons;
} & Omit<HTMLProps<HTMLAnchorElement>, 'href'>;

export const SidebarItem = forwardRef<HTMLAnchorElement, Props>(
  ({ label, to, icon, className, ...props }, ref) => {
    const pathname = usePathname();
    const href = to.toString();
    const isActive =
      href === '/' ? pathname === '/' : pathname?.startsWith(href);

    const Icon = icon ? icons[icon] : null;

    return (
      <Link
        href={to}
        ref={ref}
        className={cn(
          'text-muted-blue hover:text-sidebar-foreground relative flex items-center gap-2 rounded py-0.5 pr-2 text-base font-medium capitalize transition-all',
          'before:bg-status-info before:absolute before:inset-y-0 before:right-0 before:h-full before:w-1 before:rounded-full before:opacity-0 before:transition-opacity before:content-[""]',
          {
            'text-sidebar-foreground font-bold before:opacity-100': isActive,
          },
          className,
        )}
        {...props}
      >
        {Icon && (
          <Icon
            className={cn('size-6 shrink-0', { 'text-status-info': isActive })}
          />
        )}
        <span>{label}</span>
      </Link>
    );
  },
);

SidebarItem.displayName = 'SidebarItem';
