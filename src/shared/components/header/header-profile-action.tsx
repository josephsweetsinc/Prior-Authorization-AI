'use client';

import { type DropdownMenuItemProps } from '@radix-ui/react-dropdown-menu';
import { icons } from 'lucide-react';
import Link from 'next/link';

import { cn } from '@/shared/lib/utils';

import { DropdownMenuItem } from '../dropdown';

export type ProfileAction = {
  type: 'link' | 'action';
  label: string;
  href?: string;
  icon?: keyof typeof icons;
  onClick?: () => void;
  variant?: 'default' | 'destructive';
};

export type HeaderProfileActionProps = ProfileAction &
  Omit<DropdownMenuItemProps, 'asChild' | 'onSelect'>;

export const HeaderProfileAction = ({
  type,
  label,
  icon,
  className,
  variant = 'default',
  ...props
}: HeaderProfileActionProps) => {
  const IconComponent = icon ? icons[icon] : null;

  if (type === 'link') {
    return (
      <DropdownMenuItem
        asChild
        className={cn('flex items-center gap-2', className)}
        variant={variant}
        {...props}
      >
        <Link href={props.href!}>
          {IconComponent && <IconComponent className='size-4' />}
          {label}
        </Link>
      </DropdownMenuItem>
    );
  }

  return (
    <DropdownMenuItem
      onSelect={props.onClick}
      className={cn('flex items-center gap-2', className)}
      variant={variant}
      {...props}
    >
      {IconComponent && <IconComponent className='size-4' />}
      {label}
    </DropdownMenuItem>
  );
};
