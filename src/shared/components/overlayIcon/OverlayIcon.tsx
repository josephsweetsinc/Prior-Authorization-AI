'use client';

import { cva } from 'class-variance-authority';
import { icons, type LucideProps } from 'lucide-react';

import { cn } from '@/shared/lib/utils';

const variants = cva('box-content size-8 p-3.5 rounded-lg', {
  variants: {
    color: {
      blue: 'text-status-info bg-blue-100',
      green: 'text-status-success bg-green-100',
      orange: 'text-status-warning bg-orange-100',
      indigo: 'text-indigo-500 bg-indigo-100',
    },
  },
  defaultVariants: {
    color: 'blue',
  },
});

type Props = {
  variant: keyof typeof icons;
  color?: 'blue' | 'green' | 'orange' | 'indigo';
  className?: string;
} & LucideProps;

export const OverlayIcon = ({
  variant,
  color = 'blue',
  className,
  ...props
}: Props) => {
  const IconComponent = icons[variant];

  if (!IconComponent) {
    return null;
  }

  return (
    <IconComponent className={cn(variants({ color }), className)} {...props} />
  );
};
