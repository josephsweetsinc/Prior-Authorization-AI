import { Download, X } from 'lucide-react';
import { type HTMLProps } from 'react';

import { cn } from '@/shared/lib/utils';

export type Props = {
  name: string;
  size?: string;
  url?: string;
  onClick?: VoidFunction;
  onRemove?: VoidFunction;
} & Omit<HTMLProps<HTMLElement>, 'size'>;

export const AttachedDocument = ({
  name,
  size,
  url,
  className,
  onClick,
  onRemove,
  ...props
}: Props) => {
  return (
    <article
      onClick={onClick}
      className={cn(
        'flex items-center justify-between rounded-xl p-4 transition-colors',
        'bg-status-info/5 hover:bg-blue-50/50',
        className,
      )}
      {...props}
    >
      <div className='flex flex-col gap-0.5 overflow-hidden'>
        <p className='truncate text-sm font-medium text-black' title={name}>
          {name}
        </p>

        {size && <p className='text-xs text-black'>{size}</p>}
      </div>

      <div className='ml-4 flex shrink-0 items-center gap-2'>
        {url && (
          <a
            href={url}
            target='_blank'
            rel='noopener noreferrer'
            className='group text-status-info flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-blue-100'
            title='Download'
            download
          >
            <Download strokeWidth={1.5} />
          </a>
        )}

        {onRemove && (
          <button
            type='button'
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className='group flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500'
            title='Remove'
          >
            <X />
          </button>
        )}
      </div>
    </article>
  );
};
