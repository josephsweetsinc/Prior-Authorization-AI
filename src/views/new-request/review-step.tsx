import { ChevronLeft, ChevronRight, SquarePen } from 'lucide-react';

import type { FormState } from '@/features/new-request/info-form/types/types';
import { Button } from '@/shared/components/button';

interface ReviewStepProps {
  onBack: () => void;
  onSubmit: () => void;
  onEdit?: () => void;
  form?: FormState | null;
  isSubmitting?: boolean;
}

const display = (v?: string | null) => (v && String(v).trim() !== '' ? v : '-');

export const ReviewStep = ({
  onBack,
  onSubmit,
  onEdit,
  form,
  isSubmitting,
}: ReviewStepProps) => {
  return (
    <div className='space-y-8'>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-[22px] font-bold text-[#232323]'>
            Review Form - {display(form?.formNumber ?? null)}
          </h2>
          <p className='mt-2 text-lg font-medium text-[#232323]'>
            Specify the transportation type, schedule and locations
          </p>
        </div>
        <div className='flex items-center gap-1'>
          <SquarePen color='#047CB4' strokeWidth={2.25} width={16} />
          <button
            type='button'
            onClick={onEdit}
            className='cursor-pointer font-semibold text-[#047CB4] underline'
          >
            Edit
          </button>
        </div>
      </div>

      <div>
        <h3 className='text-lg font-bold text-[#193782]'>
          Transportation Details
        </h3>
        <div className='mt-6 grid grid-cols-3 gap-6'>
          <div>
            <span className='text-sm font-medium text-[#4A5568]'>
              Transportation Type:
            </span>
            <p className='font-medium text-[#232323]'>
              {display(form?.transportationType ?? null)}
            </p>
          </div>
          <div>
            <span className='text-sm font-medium text-[#4A5568]'>
              Patient Name:
            </span>
            <p className='font-medium text-[#232323]'>
              {display(
                `${form?.patientFirstName ?? ''} ${form?.patientLastName ?? ''}`,
              )}
            </p>
          </div>
          <div>
            <span className='text-sm font-medium text-[#4A5568]'>
              Date of Birth:
            </span>
            <p className='font-medium text-[#232323]'>
              {display(form?.patientDob ?? null)}
            </p>
          </div>

          <div>
            <span className='text-sm font-medium text-[#4A5568]'>
              Patient ID:
            </span>
            <p className='font-medium text-[#232323]'>
              {display(form?.patientId ?? null)}
            </p>
          </div>
          <div>
            <span className='text-sm font-medium text-[#4A5568]'>
              Date of Transport:
            </span>
            <p className='font-medium text-[#232323]'>
              {display(form?.dateOfTransport ?? null)}
            </p>
          </div>
          <div>
            <span className='text-sm font-medium text-[#4A5568]'>
              Time of Transport:
            </span>
            <p className='font-medium text-[#232323]'>
              {display(form?.timeOfTransport ?? null)}
            </p>
          </div>

          <div>
            <span className='text-sm font-medium text-[#4A5568]'>
              Primary Diagnosis:
            </span>
            <p className='font-medium text-[#232323]'>
              {display(form?.primaryDiagnosis ?? null)}
            </p>
          </div>
          <div>
            <span className='text-sm font-medium text-[#4A5568]'>
              Pickup Address:
            </span>
            <p className='font-medium text-[#232323]'>
              {display(form?.pickupAddress ?? null)}
            </p>
          </div>
          <div>
            <span className='text-sm font-medium text-[#4A5568]'>
              Destination Address:
            </span>
            <p className='font-medium text-[#232323]'>
              {display(form?.destinationAddress ?? null)}
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
            {display(form?.medicalJustification ?? null)}
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
          disabled={isSubmitting}
          className='w-fit !px-10 !py-3 font-medium'
        >
          Create Request
          <ChevronRight color='#FFFFFF' strokeWidth={1.5} />
        </Button>
      </div>
    </div>
  );
};
