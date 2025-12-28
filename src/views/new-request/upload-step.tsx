import { ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-toastify';

import { type ExtractionResponse, useExtraction } from '@/services';
import { Uploader, type MediaItem } from '@/shared/components';
import { Button } from '@/shared/components/button';

interface UploadStepProps {
  onNext: (_extractionResult?: ExtractionResponse | null) => void;
}

export const UploadStep = ({ onNext }: UploadStepProps) => {
  const [files, setFiles] = useState<MediaItem[]>([]);
  const { extractFiles, isLoading } = useExtraction();

  const handleNext = async () => {
    if (!files || files.length === 0) {
      toast.error('Please upload at least one document before proceeding.');
      return;
    }

    try {
      const fileIds = files
        .map((f) => {
          const id = f?.id;
          return id !== undefined && id !== null ? Number(id) : undefined;
        })
        .filter(
          (id): id is number => typeof id === 'number' && !Number.isNaN(id),
        );

      if (fileIds.length === 0) {
        toast.error(
          'No valid uploaded files found. Please try uploading again.',
        );
        return;
      }

      const result = await extractFiles(fileIds);
      console.warn('Extraction result', result);

      onNext(result ?? null);
    } catch (err: unknown) {
      let msg = 'Failed to extract data from documents. Please try again.';
      if (err && typeof err === 'object') {
        const maybeErr = err as { message?: unknown };
        if (maybeErr && typeof maybeErr.message === 'string') {
          msg = maybeErr.message;
        }
      }
      toast.error(String(msg));
      console.error('handleNext extractFiles error', err);
    }
  };

  return (
    <div className='space-y-8'>
      <h2 className='text-[22px] font-bold text-[#232323]'>
        Upload Required Documents
      </h2>

      <Uploader value={files} onChangeAction={setFiles} />

      <div className='flex justify-end'>
        <Button
          variant='primary'
          size='lg'
          onClick={handleNext}
          className='w-fit !px-10 !py-3 font-medium'
          disabled={isLoading}
        >
          {isLoading ? (
            'Processing...'
          ) : (
            <>
              Next
              <ChevronRight color='#FFFFFF' strokeWidth={1.5} />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
