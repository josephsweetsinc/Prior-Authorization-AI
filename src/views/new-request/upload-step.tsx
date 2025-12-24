import { ChevronRight } from 'lucide-react';

import { Button } from '@/shared/components/button';

interface UploadStepProps {
  onNext: () => void;
}

export const UploadStep = ({ onNext }: UploadStepProps) => {
  return (
    <div className='space-y-8'>
      <h2 className='text-[22px] font-bold text-[#232323]'>
        Upload Required Documents
      </h2>

      <div className='mt-4 flex h-64 w-full items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50'>
        <span className='text-slate-400'>Drag & Drop Area placeholder</span>
      </div>

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
