import { type HTMLProps } from 'react';

import {
  AttachedDocumentSkeleton,
  Modal,
  Separator,
  Skeleton,
  TitleAndDesc,
} from '@/shared/components';
import { cn } from '@/shared/lib/utils';

import { DataBlockSkeleton } from './DataBlockSkeleton';
import { StatusTimelineSkeleton } from './StatusTimelineSkeleton';
type Props = {
  open: boolean;
  onClose: VoidFunction;
} & HTMLProps<HTMLDivElement>;

export const RequestDetailsSkeleton = ({
  open,
  className,
  onClose,
  ...props
}: Props) => {
  return (
    <Modal
      isOpen={open}
      onCloseAction={onClose}
      className={cn('w-[80%] xl:w-2/3', className)}
      {...props}
    >
      <div className='max-h-[80dvh] overflow-y-auto p-3'>
        <TitleAndDesc
          title='Request Details'
          subtitle='View comprehensive information about this authorization request'
        />

        <section className='my-5 flex flex-wrap items-end justify-between gap-8'>
          <DataBlockSkeleton />
          <Skeleton className='h-6 w-24 rounded-full' />
        </section>

        <Separator className='bg-gray-separator' />

        <section className='my-5 flex flex-wrap gap-5'>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className='shrink grow basis-[288px]'>
              <DataBlockSkeleton />
            </div>
          ))}
        </section>
        <Separator className='bg-gray-separator' />
        <Skeleton className='mt-5 h-6 w-24' />
        <StatusTimelineSkeleton className='my-5' />
        <Separator className='bg-gray-separator' />

        <section className='mt-5'>
          <Skeleton className='mb-5 h-6 w-24' />
          <div className='flex flex-wrap gap-5'>
            {Array.from({ length: 2 }).map((_, i) => (
              <AttachedDocumentSkeleton
                className='shrink grow basis-[288px]'
                key={i}
              />
            ))}
          </div>
        </section>
      </div>
    </Modal>
  );
};
