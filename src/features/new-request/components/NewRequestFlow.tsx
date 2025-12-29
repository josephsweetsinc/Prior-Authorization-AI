'use client';

import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import type { FormState } from '@/features/new-request';
import {
  setForm,
  clear,
  setExtractionResult,
} from '@/features/new-request/helpers/newRequestSlice';
import {
  extractedToForm,
  formToExtracted,
  selectNewRequest,
} from '@/services/new-request';
import { useCreateRequest } from '@/services/new-request/hooks/useCreateRequest';
import { getErrorMessage } from '@/services/new-request/utils';
import { TitleAndDesc, Window } from '@/shared/components';
import { Stepper } from '@/shared/components/stepper/stepper';
import { InfoStep } from '@/views/new-request/info-step';
import { ReviewStep } from '@/views/new-request/review-step';
import { UploadStep } from '@/views/new-request/upload-step';

import { useNewRequestFlow } from '../hooks/useNewRequestFlow';

const TOTAL_STEPS = 3;

export function NewRequestFlow() {
  const stored = useSelector(selectNewRequest);

  const dispatch = useDispatch();

  const handleExtractionReady = (data: Record<string, unknown>) =>
    dispatch(setExtractionResult(data));

  const {
    step,
    next,
    prev,
    isReviewEditing,
    startReviewEdit,
    finishReviewEdit,
    extractedData,
    extractionResult,
    isExtractionComplete,
  } = useNewRequestFlow({
    totalSteps: TOTAL_STEPS,
    initialExtractedData: stored?.extractedData,
    initialExtractionResult: stored?.extractionResult,
    onExtractionReady: handleExtractionReady,
  });

  const { createRequest, isLoading: isCreating } = useCreateRequest();
  const router = useRouter();

  const reviewForm: FormState | null =
    (stored?.form as FormState | null) ?? extractedToForm(extractedData);

  const handleCreate = async () => {
    try {
      await createRequest();

      dispatch(clear());

      toast(
        <div>
          <div className='text-[#171923]'>Request Successfully Created</div>
          <div className='text-gray-dark'>
            Your authorization request has been submitted and is now awaiting
            review.
          </div>
        </div>,
        {
          style: {
            background: 'rgba(255,255,255,0.9)',
            color: '',
            padding: '14px 16px',
            border: '1px solid #EAEAEA',
            borderRadius: '16px',
          },
        },
      );

      router.push('/dashboard');
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, 'Failed to create ambulance request'));
    }
  };

  const handleInfoNext = (res?: Record<string, unknown> | null) => {
    if (res) {
      dispatch(setForm(res));
    }
    next();
  };

  const handleReviewEditNext = (res?: Record<string, unknown> | null) => {
    if (res) {
      dispatch(setForm(res));
    }
    finishReviewEdit();
  };

  function renderStep() {
    if (step === 1) {
      return <UploadStep onNext={next} />;
    }

    if (step === 2) {
      return (
        <InfoStep
          onBack={prev}
          onNext={handleInfoNext}
          initialValues={extractedData}
          isComplete={Boolean(extractionResult?.is_complete)}
        />
      );
    }

    if (step === 3) {
      if (isReviewEditing) {
        return (
          <InfoStep
            onBack={finishReviewEdit}
            onNext={handleReviewEditNext}
            initialValues={
              stored?.form
                ? formToExtracted(stored.form as FormState)
                : extractedData
            }
            mode='review-edit'
            isComplete={isExtractionComplete}
          />
        );
      }

      return (
        <ReviewStep
          onBack={prev}
          onSubmit={handleCreate}
          onEdit={startReviewEdit}
          form={reviewForm ?? undefined}
          isSubmitting={isCreating}
        />
      );
    }

    return null;
  }

  return (
    <main>
      <TitleAndDesc
        title='Create New Request'
        subtitle='Enter transportation details, patient information and attach required medical documents.'
      />

      <Stepper
        currentStep={step}
        totalSteps={TOTAL_STEPS}
        className='mt-6 mb-4'
      />

      <Window>{renderStep()}</Window>
    </main>
  );
}
