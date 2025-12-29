import { ChevronLeft, ChevronRight, SquarePen } from 'lucide-react';

import type { FormState } from '@/features/new-request';
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
          <h2 className='text-[22px] font-bold text-black'>
            Review Form - {display(form?.formNumber ?? null)}
          </h2>
          <p className='mt-2 text-lg font-medium text-black'>
            Specify the transportation type, schedule and locations
          </p>
        </div>
        <div className='flex items-center gap-1'>
          <SquarePen className='text-status-info size-4' strokeWidth={2.25} />
          <button
            type='button'
            onClick={onEdit}
            className='text-status-info cursor-pointer font-semibold underline'
          >
            Edit
          </button>
        </div>
      </div>

      <div>
        <h3 className='text-brand-dark text-lg font-bold'>
          Transportation Details
        </h3>
        <div className='mt-6 grid grid-cols-3 gap-6'>
          <div>
            <span className='text-gray-dark text-sm font-medium'>
              Transportation Type:
            </span>
            <p className='font-medium text-black'>
              {display(form?.transportationType ?? null)}
            </p>
          </div>
          <div>
            <span className='text-gray-dark text-sm font-medium'>
              Patient Name:
            </span>
            <p className='font-medium text-black'>
              {display(
                `${form?.patientFirstName ?? ''} ${form?.patientLastName ?? ''}`,
              )}
            </p>
          </div>
          <div>
            <span className='text-gray-dark text-sm font-medium'>
              Date of Birth:
            </span>
            <p className='font-medium text-black'>
              {display(form?.patientDob ?? null)}
            </p>
          </div>

          <div>
            <span className='text-gray-dark text-sm font-medium'>
              Patient ID:
            </span>
            <p className='font-medium text-black'>
              {display(form?.patientId ?? null)}
            </p>
          </div>
          <div>
            <span className='text-gray-dark text-sm font-medium'>
              Date of Transport:
            </span>
            <p className='font-medium text-black'>
              {display(form?.dateOfTransport ?? null)}
            </p>
          </div>
          <div>
            <span className='text-gray-dark text-sm font-medium'>
              Time of Transport:
            </span>
            <p className='font-medium text-black'>
              {display(form?.timeOfTransport ?? null)}
            </p>
          </div>

          <div>
            <span className='text-gray-dark text-sm font-medium'>
              Primary Diagnosis:
            </span>
            <p className='font-medium text-black'>
              {display(form?.primaryDiagnosis ?? null)}
            </p>
          </div>
          <div>
            <span className='text-gray-dark text-sm font-medium'>
              Pickup Address:
            </span>
            <p className='font-medium text-black'>
              {display(form?.pickupAddress ?? null)}
            </p>
          </div>
          <div>
            <span className='text-gray-dark text-sm font-medium'>
              Destination Address:
            </span>
            <p className='font-medium text-black'>
              {display(form?.destinationAddress ?? null)}
            </p>
          </div>
        </div>
      </div>

      <div className='h-px w-full bg-[#E8E8E8]' />

      <div>
        <h3 className='text-brand-dark text-lg font-bold'>
          Medical Justification
        </h3>
        <div className='mt-6'>
          <p className='font-medium text-black'>
            {display(form?.medicalJustification ?? null)}
          </p>
        </div>
      </div>

      <div className='flex justify-between pt-4'>
        <Button
          variant='gray'
          onClick={onBack}
          className='w-fit px-10! py-3! font-medium'
        >
          <ChevronLeft className='text-black' strokeWidth={1.5} />
          Back
        </Button>
        <Button
          variant='primary'
          onClick={onSubmit}
          disabled={isSubmitting}
          className='w-fit px-10! py-3! font-medium'
        >
          Create Request
          <ChevronRight className='text-white' strokeWidth={1.5} />
        </Button>
      </div>
    </div>
  );
};
