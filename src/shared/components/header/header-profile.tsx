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

import {
  HeaderProfileAction,
  type ProfileAction,
} from './header-profile-action';

export interface HeaderProfileProps extends UserProps {
  actions?: ProfileAction[];
}

const HeaderProfile = forwardRef<HTMLDivElement, HeaderProfileProps>(
  ({ name, role, src, alt, actions = [], className, ...props }, ref) => {
    const [open, setOpen] = useState(false);

    return (
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <div
            className={cn('flex items-center gap-2', className)}
            ref={ref}
            {...props}
          >
            <Avatar name={name} role={role} src={src} alt={alt} className='' />
            <ChevronDown
              className={cn(
                'size-4 transition-transform duration-200',
                open ? 'rotate-180' : 'rotate-0',
              )}
            />
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
