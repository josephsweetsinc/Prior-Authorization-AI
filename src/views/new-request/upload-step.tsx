import { ChevronRight } from 'lucide-react';
import { useState } from 'react';

import { Uploader, type MediaItem } from '@/shared/components';
import { Button } from '@/shared/components/button';

interface UploadStepProps {
  onNext: () => void;
}

export const UploadStep = ({ onNext }: UploadStepProps) => {
  const [files, setFiles] = useState<MediaItem[]>([]);

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
          onClick={onNext}
          className='w-fit !px-10 !py-3 font-medium'
        >
          Next
          <ChevronRight color='#FFFFFF' strokeWidth={1.5} />
        </Button>
      </div>
    </div>
  );
};
