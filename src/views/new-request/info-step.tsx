import { ChevronLeft, ChevronRight } from 'lucide-react';
import React from 'react';

import { InfoFormFields } from '@/features/new-request/info-form/components/InfoFormFields';
import { useInfoForm } from '@/features/new-request/info-form/hook/useInfoForm';
import { Button, SensitiveMessage } from '@/shared/components';

interface InfoStepProps {
  onBack: () => void;
  onNext: (_res?: Record<string, unknown> | null) => void;
  initialValues?: Record<string, unknown> | null;
  isComplete?: boolean;
  mode?: 'default' | 'review-edit';
}

export const InfoStep = ({
  onBack,
  onNext,
  initialValues = null,
  isComplete = false,
  mode = 'default',
}: InfoStepProps) => {
  const { form, setForm, errors, isFormComplete } = useInfoForm(initialValues);

  const isReviewEdit = mode === 'review-edit';

  return (
    <div className='space-y-8'>
      <div>
        {isReviewEdit ? (
          <>
            <h2 className='text-[22px] font-bold text-[#232323]'>
              Review Form - {form.formNumber}
            </h2>
            <p className='mt-2 text-lg font-medium text-[#232323]'>
              Specify the transportation type, schedule and locations
            </p>

            <p className='mt-8 text-lg font-bold text-[#193782]'>
              Transportation Details
            </p>
          </>
        ) : (
          <>
            <h2 className='text-[22px] font-bold text-[#232323]'>
              Transportation Information
            </h2>
            <p className='mt-2 text-lg font-medium text-[#232323]'>
              Specify the transportation type, schedule and locations
            </p>
          </>
        )}
      </div>

      {isComplete && (
        <SensitiveMessage
          variant='success'
          title='All Required Fields Validated'
          description='The AI has successfully extracted and validated all required information from your documents.'
        />
      )}

      <div className='space-y-5'>
        <InfoFormFields form={form} setForm={setForm} errors={errors} />
      </div>

      <div
        className={
          isReviewEdit
            ? 'flex justify-end gap-3 pt-4'
            : 'flex justify-between pt-4'
        }
      >
        {isReviewEdit ? (
          <>
            <Button
              variant='gray'
              size='lg'
              onClick={onBack}
              className='w-fit !px-10 !py-3 font-medium'
            >
              Cancel
            </Button>
            <Button
              variant='primary'
              size='lg'
              onClick={() => onNext(form)}
              className='w-fit !px-10 !py-3 font-medium'
              disabled={!isFormComplete}
            >
              Save Changes
            </Button>
          </>
        ) : (
          <>
            <Button
              variant='gray'
              size='lg'
              onClick={onBack}
              className='w-fit !px-10 !py-3 font-medium'
            >
              <ChevronLeft color='#232323' strokeWidth={1.5} />
              Back
            </Button>
            <Button
              variant='primary'
              size='lg'
              onClick={() => onNext(form)}
              className='w-fit !px-10 !py-3 font-medium'
              disabled={!isFormComplete}
            >
              Next
              <ChevronRight color='#FFFFFF' strokeWidth={1.5} />
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
