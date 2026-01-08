'use client';

import { ChevronDown } from 'lucide-react';
import { forwardRef, useState } from 'react';

import { cn } from '@/shared/lib/utils';

import { Avatar, type UserProps } from '../avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '../dropdown';
import { Skeleton } from '../skeleton';

import {
  HeaderProfileAction,
  type ProfileAction,
} from './header-profile-action';

export interface HeaderProfileProps extends UserProps {
  actions?: ProfileAction[];
  isLoading?: boolean;
}

const HeaderProfile = forwardRef<HTMLDivElement, HeaderProfileProps>(
  (
    {
      name,
      role,
      src,
      alt,
      actions = [],
      className,
      isLoading,
      size,
      ...props
    },
    ref,
  ) => {
    const [open, setOpen] = useState(false);
    const avatarSkeletonClass =
      size === 'sm' ? 'size-8' : size === 'lg' ? 'size-16' : 'size-11';
    const nameSkeletonClass =
      size === 'sm' ? 'h-3 w-16' : size === 'lg' ? 'h-5 w-28' : 'h-4 w-24';
    const roleSkeletonClass =
      size === 'sm' ? 'h-2.5 w-12' : size === 'lg' ? 'h-4 w-20' : 'h-3 w-16';

    return (
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <div
            className={cn('flex items-center gap-2', className)}
            ref={ref}
            {...props}
          >
            {isLoading ? (
              <>
                <Skeleton className={cn('rounded-full', avatarSkeletonClass)} />
                <div className='flex flex-col gap-2'>
                  <Skeleton className={nameSkeletonClass} />
                  <Skeleton className={roleSkeletonClass} />
                </div>
              </>
            ) : (
              <>
                <Avatar
                  name={name}
                  role={role}
                  src={src}
                  alt={alt}
                  size={size}
                />
                <ChevronDown
                  className={cn(
                    'size-4 transition-transform duration-200',
                    open ? 'rotate-180' : 'rotate-0',
                  )}
                />
              </>
            )}
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent align='end' sideOffset={4}>
          {actions.map((action) => (
            <HeaderProfileAction {...action} key={action.label} />
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
);

HeaderProfile.displayName = 'HeaderProfile';

export { HeaderProfile };
