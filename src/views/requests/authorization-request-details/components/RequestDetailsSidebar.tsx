'use client';

import { useState } from 'react';

import { formatFileSize } from '@/services/media';
import { type IDocument } from '@/services/requests';
import { Modal, StatusTimeline, Window } from '@/shared/components';
import { AttachedDocument } from '@/shared/components/attached-document';

import { type RequestDetailsTimelineItem } from '../lib/types';

import { RequestActions } from './RequestActions';

type Props = {
  shouldShowActions: boolean;
  onApprove: () => void;
  onDeny: () => void;
  timelineItems: RequestDetailsTimelineItem[];
  documents: IDocument[];
};

export const RequestDetailsSidebar = ({
  shouldShowActions,
  onApprove,
  onDeny,
  timelineItems,
  documents,
}: Props) => {
  const [previewDocument, setPreviewDocument] = useState<IDocument | null>(
    null,
  );

  return (
    <div className='space-y-5'>
      <RequestActions
        isVisible={shouldShowActions}
        onApprove={onApprove}
        onDeny={onDeny}
      />

      <Window className='p-6'>
        <h3 className='text-brand-dark mb-5 text-xl font-bold'>Activity Log</h3>
        {timelineItems.length > 0 ? (
          <StatusTimeline items={timelineItems} />
        ) : (
          <p className='text-muted-foreground text-sm'>
            No activity recorded yet.
          </p>
        )}
      </Window>

      {documents.length > 0 && (
        <Window className='p-6'>
          <h3 className='text-brand-dark mb-5 text-xl font-bold'>Documents</h3>
          <div className='space-y-4'>
            {documents.map((document) => (
              <AttachedDocument
                key={document.id}
                name={document.filename}
                size={formatFileSize(document.file_size)}
                url={document.download_url}
                onClick={() => setPreviewDocument(document)}
              />
            ))}
          </div>
        </Window>
      )}

      <Modal
        isOpen={Boolean(previewDocument)}
        className='w-200'
        onCloseAction={() => setPreviewDocument(null)}
      >
        <div className='mt-4'>
          <div className='mb-4 text-[24px] font-semibold text-black'>
            {previewDocument?.filename}
          </div>
          {(() => {
            const url = previewDocument?.download_url ?? '';
            const ctype = previewDocument?.content_type ?? '';
            const isPdf =
              ctype.includes('pdf') || url.toLowerCase().endsWith('.pdf');
            if (isPdf && url) {
              return (
                <object
                  data={url}
                  type='application/pdf'
                  width='100%'
                  height='600px'
                >
                  <p className='text-sm text-[#64748B]'>
                    Preview not available. You can download the file using the
                    button above.
                  </p>
                </object>
              );
            }

            return (
              <div className='flex flex-col items-start gap-2'>
                <p className='text-sm text-[#334155]'>
                  Preview not available for this file type.
                </p>
                {url && (
                  <a
                    href={url}
                    target='_blank'
                    rel='noopener noreferrer'
                    download
                    className='text-status-info rounded-md border border-[#047CB4] bg-white px-3 py-1 text-sm font-medium'
                  >
                    Download
                  </a>
                )}
              </div>
            );
          })()}
        </div>
      </Modal>
    </div>
  );
};
