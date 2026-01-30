import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect } from 'react';

import {
  type FormState,
  InfoFormFields,
  useInfoForm,
} from '@/features/new-request';
import { extractedToForm, type IExtractedData } from '@/services';
import { Button, SensitiveMessage } from '@/shared/components';

import {
  INFO_STEP_STATUS_CONFIG,
  type InfoStepOverallStatus,
} from './constants';

export interface InfoStepProps {
  onBack?: () => void;
  onNext: (_res?: Partial<FormState> | null) => void;
  initialValues?: Partial<IExtractedData> | null;
  overallStatus?: InfoStepOverallStatus;
  mode?: 'default' | 'review-edit';
  hideBackButton?: boolean;
}

export const InfoStep = ({
  onBack,
  onNext,
  initialValues = null,
  overallStatus,
  mode = 'default',
  hideBackButton = false,
}: InfoStepProps) => {
  const { form, setForm, errors, isFormComplete } = useInfoForm();

  useEffect(() => {
    if (initialValues) {
      const formData = extractedToForm(initialValues);

      if (!formData) {
        return;
      }

      setForm(formData);
    }
  }, [initialValues, setForm]);

  const isReviewEdit = mode === 'review-edit';

  return (
    <div className='space-y-8'>
      <div>
        {isReviewEdit ? (
          <>
            <h2 className='text-[22px] font-bold text-black'>
              Review Form - {form.formNumber}
            </h2>
            <p className='mt-2 text-lg font-medium text-black'>
              Specify the transportation type, schedule and locations
            </p>

            <p className='text-brand-dark mt-8 text-lg font-bold'>
              Transportation Details
            </p>
          </>
        ) : (
          <>
            <h2 className='text-[22px] font-bold text-black'>
              Transportation Information
            </h2>
            <p className='mt-2 text-lg font-medium text-black'>
              Specify the transportation type, schedule and locations
            </p>
          </>
        )}
      </div>

      {overallStatus && (
        <SensitiveMessage
          variant={overallStatus}
          {...INFO_STEP_STATUS_CONFIG[overallStatus]}
        />
      )}

      <div className='space-y-5'>
        <InfoFormFields form={form} setForm={setForm} errors={errors} />
      </div>

      <div
        className={
          isReviewEdit
            ? 'flex justify-end gap-3 pt-4'
            : hideBackButton
              ? 'flex justify-end pt-4'
              : 'flex justify-between pt-4'
        }
      >
        {isReviewEdit ? (
          <>
            <Button
              variant='gray'
              size='lg'
              onClick={onBack}
              className='w-fit px-10! py-3! font-medium'
            >
              Cancel
            </Button>
            <Button
              variant='primary'
              size='lg'
              onClick={() => onNext(form)}
              className='w-fit px-10! py-3! font-medium'
              disabled={!isFormComplete}
            >
              Save Changes
            </Button>
          </>
        ) : (
          <>
            {!hideBackButton && (
              <Button
                variant='gray'
                size='lg'
                onClick={onBack}
                className='w-fit px-10! py-3! font-medium'
              >
                <ChevronLeft className='text-black' strokeWidth={1.5} />
                Back
              </Button>
            )}

            <Button
              variant='primary'
              size='lg'
              onClick={() => onNext(form)}
              className='w-fit px-10! py-3! font-medium'
              disabled={!isFormComplete}
            >
              Next
              <ChevronRight className='text-white' strokeWidth={1.5} />
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
