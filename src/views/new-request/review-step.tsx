import { ChevronLeft, ChevronRight, SquarePen } from 'lucide-react';

import { SensitiveMessage } from '@/shared/components';
import { Button } from '@/shared/components/button';

interface ReviewStepProps {
  onBack: () => void;
  onSubmit: () => void;
}

export const ReviewStep = ({ onBack, onSubmit }: ReviewStepProps) => {
  return (
    <div className='space-y-8'>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-[22px] font-bold text-[#232323]'>
            Review Form - CMS-10344
          </h2>
          <p className='mt-2 text-lg font-medium text-[#232323]'>
            Specify the transportation type, schedule and locations
          </p>
        </div>
        <div className='flex items-center gap-1'>
          <SquarePen color='#047CB4' strokeWidth={2.25} width={16} />{' '}
          <span className='cursor-pointer font-semibold text-[#047CB4] underline'>
            Edit
          </span>
        </div>
      </div>

      <SensitiveMessage
        variant='success'
        title='All Required Fields Validated'
        description='The AI has successfully extracted and validated all required information from your documents.'
      />

      <div>
        <h3 className='text-lg font-bold text-[#193782]'>
          Transportation Details
        </h3>
        <div className='mt-6 grid grid-cols-3 gap-6'>
          <div>
            <span className='text-sm font-medium text-[#4A5568]'>
              Transportation Type:
            </span>
            <p className='font-medium text-[#232323]'>Ambulance - BLS</p>
          </div>
          <div>
            <span className='text-sm font-medium text-[#4A5568]'>
              Patient Name:
            </span>

            <p className='font-medium text-[#232323]'>John Doe</p>
          </div>
          <div>
            <span className='text-sm font-medium text-[#4A5568]'>
              Date of Birth:
            </span>

            <p className='font-medium text-[#232323]'>12-07-1987</p>
          </div>

          <div>
            <span className='text-sm font-medium text-[#4A5568]'>
              Patient ID:
            </span>

            <p className='font-medium text-[#232323]'>AB1234567890ID</p>
          </div>
          <div>
            <span className='text-sm font-medium text-[#4A5568]'>
              Date of Transport:
            </span>

            <p className='font-medium text-[#232323]'>08-19-2025</p>
          </div>
          <div>
            <span className='text-sm font-medium text-[#4A5568]'>
              Time of Transport:
            </span>

            <p className='font-medium text-[#232323]'>10:20 AM</p>
          </div>

          <div>
            <span className='text-sm font-medium text-[#4A5568]'>
              Primary Diagnosis:
            </span>

            <p className='font-medium text-[#232323]'>
              Chronic heart failure, mobility impaired
            </p>
          </div>
          <div>
            <span className='text-sm font-medium text-[#4A5568]'>
              Pickup Address:
            </span>

            <p className='font-medium text-[#232323]'>
              123 Main St, Springfield, IL 62701
            </p>
          </div>
          <div>
            <span className='text-sm font-medium text-[#4A5568]'>
              Destination Address:
            </span>

            <p className='font-medium text-[#232323]'>
              Memorial Dialysis Center, 456 Medical Dr, Springfield, IL 62702
            </p>
          </div>
        </div>
      </div>

      <div className='h-[1px] w-full bg-[#E8E8E8]' />

      <div>
        <h3 className='text-lg font-bold text-[#193782]'>
          Medical Justification
        </h3>
        <div className='mt-6'>
          <p className='font-medium text-[#232323]'>
            Patient requires repetitive non-emergent ambulance transport for
            dialysis treatment three times weekly. Patient is bedbound and
            unable to sit upright for extended periods due to severe
            cardiovascular complications. Standard wheelchair van transport is
            contraindicated.
          </p>
        </div>
      </div>

      <div className='flex justify-between pt-4'>
        <Button
          variant='gray'
          onClick={onBack}
          className='w-fit !px-10 !py-3 font-medium'
        >
          <ChevronLeft color='#232323' strokeWidth={1.5} />
          Back
        </Button>
        <Button
          variant='primary'
          onClick={onSubmit}
          className='w-fit !px-10 !py-3 font-medium'
        >
          Create Request
          <ChevronRight color='#FFFFFF' strokeWidth={1.5} />
        </Button>
      </div>
    </div>
  );
};
