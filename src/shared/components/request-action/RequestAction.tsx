'use client';

import { icons } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { type HTMLProps } from 'react';

import { cn } from '@/shared/lib/utils';

type Props = {
  id: number;
  status: 'approved' | 'pending' | 'draft' | 'submitted' | 'denied';
  onClick: (_id: number) => void;
  label?: string;
  icon?: keyof typeof icons;
} & Omit<HTMLProps<HTMLButtonElement>, 'onClick' | 'id' | 'type'>;

export const RequestAction = ({
  id,
  status,
  onClick,
  label = 'More Details',
  icon = 'ArrowUpRight',
  className,
  ...props
}: Props) => {
  const Icon = icons[icon];
  const router = useRouter();

  const handleClick = () => {
    if (status === 'draft') {
      router.push(`/new-request/${id}`);
      return;
    }

    onClick(id);
  };

  return (
    <button
      type='button'
      onClick={handleClick}
      className={cn(
        'text-accent-foreground flex items-center gap-2',
        className,
      )}
      {...props}
    >
      <span>{label}</span>
      {icon && <Icon className='text-status-info size-5' />}
    </button>
  );
};
