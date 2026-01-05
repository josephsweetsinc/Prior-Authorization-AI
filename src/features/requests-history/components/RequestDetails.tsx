import { format } from 'date-fns';
import { type HTMLProps } from 'react';

import { formatFileSize } from '@/services/media';
import { useGetRequestDetailsQuery } from '@/services/requests-history';
import {
  Modal,
  StatusChip,
  Separator,
  TitleAndDesc,
} from '@/shared/components';
import { AttachedDocument } from '@/shared/components/attached-document';
import { cn } from '@/shared/lib/utils';

import { DataBlock } from './DataBlock';
import { RequestDetailsSkeleton } from './skeletons/RequestDetailsSkeleton';
import { StatusTimeline } from './StatusTimeline';

type Props = {
  requestId: number;
  open: boolean;
  onClose: VoidFunction;
} & HTMLProps<HTMLDivElement>;

export const RequestDetails = ({
  requestId,
  open,
  className,
  onClose,
  ...props
}: Props) => {
  const { data, isLoading } = useGetRequestDetailsQuery(requestId);

  if (isLoading) {
    return (
      <RequestDetailsSkeleton
        open={open}
        className={className}
        onClose={onClose}
        {...props}
      />
    );
  }

  if (!data) {
    return;
  }

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
          titleClassName='text-lg md:text-xl lg:text-2xl xl:text-3xl '
          subtitleClassName='text-xs md:text-sm lg:text-base xl:text-lg'
        />
        <section className='my-5 flex flex-wrap items-end justify-between gap-8'>
          <DataBlock label='MRN' value={data.id.toString()} />
          <StatusChip status={data.status} />
        </section>
        <Separator className='bg-gray-200' />

        <section className='my-5 flex flex-wrap items-stretch gap-5'>
          <DataBlock
            label='Patient Name'
            value={`${data?.patient_first_name} ${data?.patient_last_name}`}
            className='shrink grow basis-[288px]'
          />
          <DataBlock
            label='Transportation Type'
            value='Ambulance - BLS'
            className='shrink grow basis-[288px]'
          />
          <DataBlock
            label='Date Submitted'
            value={format(data.created_at, 'MM/dd/yyyy')}
            className='shrink grow basis-[288px]'
          />
          <DataBlock
            label='Patient ID'
            value={data.user_id.toString()}
            className='shrink grow basis-[288px]'
          />
          <DataBlock
            label='Pickup Address'
            value='123 Main St, Springfield, IL 62701'
            className='shrink grow basis-[288px]'
          />
          <DataBlock
            label='Destination Address'
            value='Memorial Dialysis Center, 456 Medical Dr, Springfield, IL 62702'
            className='shrink grow basis-[288px]'
          />
        </section>
        <Separator className='bg-gray-200' />
        <StatusTimeline history={data.status_history} className='my-5' />
        {data.documents.length > 0 && (
          <>
            <Separator className='bg-gray-200' />
            <section className='mt-5 space-y-5'>
              <h2 className='text-brand-dark text-base font-bold lg:text-lg xl:text-xl'>
                Status timeline
              </h2>
              <div className='flex flex-wrap items-center gap-5'>
                {data.documents.map((document) => (
                  <AttachedDocument
                    name={document.filename}
                    size={formatFileSize(document.file_size)}
                    url={document.download_url}
                    key={document.id}
                    className='shrink grow basis-88.5'
                  />
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </Modal>
  );
};
