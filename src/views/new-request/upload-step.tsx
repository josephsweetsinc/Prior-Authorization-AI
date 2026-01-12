import { ChevronRight, LoaderCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-toastify';

import {
  type IExtractionResponse,
  useExtractFileData,
} from '@/services/new-request';
import { Uploader, type MediaItem, Button } from '@/shared/components';

interface UploadStepProps {
  onNext: (
    // eslint-disable-next-line no-unused-vars
    uploadedFiles: MediaItem[],
    // eslint-disable-next-line no-unused-vars
    extractionResult: IExtractionResponse | null,
  ) => void;
}

export const UploadStep = ({ onNext }: UploadStepProps) => {
  const [files, setFiles] = useState<MediaItem[]>([]);
  const { extractFiles, isLoading } = useExtractFileData();

  const handleNext = async () => {
    if (!files.length) {
      toast.error('Please upload at least one document before proceeding.');
      return;
    }

    try {
      const fileIds = files.map((f) => f.id).filter(Boolean) as number[];

      if (!fileIds.length) {
        return;
      }

      const result = await extractFiles(fileIds);

      onNext(files, result);
    } catch (err) {
      toast.error('Failed to extract data from uploaded files.');
      console.error(err);
    }
  };

  return (
    <div className='space-y-8'>
      <h2 className='text-[22px] font-bold text-black'>
        Upload Required Documents
      </h2>

      <Uploader value={files} onChangeAction={setFiles} multiple />

      <div className='flex justify-end'>
        <Button
          variant='primary'
          size='lg'
          onClick={handleNext}
          className='w-fit px-10! py-3! font-medium'
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span>Processing...</span>
              <LoaderCircle className='size-5 animate-spin text-white' />
            </>
          ) : (
            <>
              Next
              <ChevronRight className='text-white' strokeWidth={1.5} />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
