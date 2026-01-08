import { formatFileSize } from '@/services/media';
import { type IDocument } from '@/services/requests-history';
import { StatusTimeline, Window } from '@/shared/components';
import { AttachedDocument } from '@/shared/components/attached-document';

import { RequestActions } from './RequestActions';

type TimelineItem = {
  title: string;
  date?: string;
  description?: string;
  status: 'approved' | 'pending' | 'processing' | 'denied';
};

type Props = {
  shouldShowActions: boolean;
  onApprove: () => void;
  timelineItems: TimelineItem[];
  documents: IDocument[];
};

export const RequestDetailsSidebar = ({
  shouldShowActions,
  onApprove,
  timelineItems,
  documents,
}: Props) => (
  <div className='space-y-5'>
    <RequestActions isVisible={shouldShowActions} onApprove={onApprove} />

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
            />
          ))}
        </div>
      </Window>
    )}
  </div>
);
