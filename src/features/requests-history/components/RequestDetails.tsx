import { format } from 'date-fns';
import { Download } from 'lucide-react';
import { type HTMLProps } from 'react';

import { formatFileSize } from '@/services/media';
import {
  useGetRequestDetailsQuery,
  useRequestPdfDownload,
} from '@/services/requests';
import {
  Button,
  Modal,
  StatusTimeline,
  StatusChip,
  Separator,
  TitleAndDesc,
  AttachedDocument,
} from '@/shared/components';
import { cn } from '@/shared/lib/utils';

import { STATUS_TO_TIMELINE_STATUS } from '../constants';
import {
  getRequestDetailsBlocks,
  transformStatusToTimelineTitle,
} from '../utils';

import { DataBlock } from './DataBlock';
import { RequestDetailsSkeleton } from './skeletons/RequestDetailsSkeleton';

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
  const { downloadRequestPdf, isDownloading } = useRequestPdfDownload();

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
    return null;
  }

  const details = getRequestDetailsBlocks(data);
  const timelineItems = data.status_history.map((item) => ({
    title: transformStatusToTimelineTitle(item.status),
    date: format(new Date(item.created_at), "MMM d, yyyy 'at' h:mm a"),
    description: item.notes ?? undefined,
    status: STATUS_TO_TIMELINE_STATUS[item.status],
  }));
  const canDownload = data.status !== 'draft';
  const handleDownload = async () => {
    if (!canDownload) {
      return;
    }

    await downloadRequestPdf({
      requestId: data.id,
      formNumber: data.form_number,
    });
  };

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
          <DataBlock label='MRN' value={data.patient_id.toString()} />
          <div className='flex items-center gap-3'>
            <StatusChip status={data.status} />
          </div>
        </section>
        <Separator className='bg-gray-separator' />

        <section className='my-5 flex flex-wrap items-stretch gap-5'>
          {details.map((detail) => (
            <DataBlock
              key={detail.label}
              label={detail.label}
              value={detail.value}
              className={detail.className}
            />
          ))}
        </section>
        {timelineItems.length > 0 && (
          <>
            <Separator className='bg-gray-separator' />
            <div className='my-5 space-y-5'>
              <h2 className='text-brand-dark text-base font-bold md:text-lg xl:text-xl'>
                Activity Log
              </h2>
              <StatusTimeline items={timelineItems} />
            </div>
          </>
        )}
        {data.documents.length > 0 && (
          <>
            <Separator className='bg-gray-separator' />
            <section className='mt-5 space-y-5'>
              <h2 className='text-brand-dark text-base font-bold lg:text-lg xl:text-xl'>
                Documents
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
        {canDownload && (
          <Button
            onClick={handleDownload}
            disabled={isDownloading}
            className='mt-10 w-auto rounded-xl px-10!'
            size='lg'
            variant='secondary'
          >
            Download PDF <Download color='#047CB4' />
          </Button>
        )}
      </div>
    </Modal>
  );
};
