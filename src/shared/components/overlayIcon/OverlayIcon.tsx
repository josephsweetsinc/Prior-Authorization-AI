'use client';

import { cva } from 'class-variance-authority';
import { icons, type LucideProps } from 'lucide-react';

import { cn } from '@/shared/lib/utils';

const variants = cva('box-content size-8 p-3.5 rounded-lg', {
  variants: {
    color: {
      blue: 'text-status-info bg-status-info/10',
      green: 'text-status-success bg-status-success/10',
      orange: 'text-status-warning bg-status-warning/10',
      red: 'text-status-destructive bg-status-destructive/10',
      indigo: 'text-status-submitted bg-status-submitted/10',
    },
  },
  defaultVariants: {
    color: 'blue',
  },
});

type Props = {
  variant: keyof typeof icons;
  color?: 'blue' | 'green' | 'orange' | 'red' | 'indigo';
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
