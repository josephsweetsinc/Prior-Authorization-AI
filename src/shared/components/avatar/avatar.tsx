'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import Image from 'next/image';
import React, { useState } from 'react';

import { cn } from '@/shared/lib/utils';

const avatarVariants = cva('inline-flex items-center gap-3 shrink-0', {
  variants: {
    size: {
      sm: '[&_[data-slot=avatar]]:size-8 [&_[data-slot=avatar]]:text-xs [&_[data-slot=name]]:text-sm [&_[data-slot=role]]:text-xs',
      default:
        '[&_[data-slot=avatar]]:size-11 [&_[data-slot=avatar]]:text-md [&_[data-slot=name]]:text-lg [&_[data-slot=role]]:text-sm',
      lg: '[&_[data-slot=avatar]]:size-16 [&_[data-slot=avatar]]:text-lg [&_[data-slot=name]]:text-xl [&_[data-slot=role]]:text-md',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

export interface UserProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants> {
  name: string;
  role?: string;
  src?: string | null;
  alt?: string;
  avatarClassName?: string;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function Avatar({
  className,
  avatarClassName,
  size,
  name,
  role,
  src,
  alt,
  ...props
}: UserProps) {
  const [imageError, setImageError] = useState(false);
  const initials = getInitials(name);

  return (
    <div className={cn(avatarVariants({ size }), className)} {...props}>
      <div
        data-slot='avatar'
        className={cn(
          'bg-muted text-muted-foreground relative flex shrink-0 items-center justify-center overflow-hidden rounded-full font-semibold select-none',
          avatarClassName,
        )}
      >
        {src && !imageError ? (
          <Image
            src={src}
            alt={alt || name}
            fill
            className='h-full w-full object-cover'
            onError={() => setImageError(true)}
          />
        ) : (
          <span>{initials}</span>
        )}
      </div>

      <div className='flex min-w-0 flex-col'>
        <span
          data-slot='name'
          className='text-foreground truncate leading-none font-semibold'
        >
          {name}
        </span>
        {role && (
          <span
            data-slot='role'
            className='text-muted-blue mt-1.5 truncate leading-none'
          >
            {role}
          </span>
        )}
      </div>
    </div>
  );
}
