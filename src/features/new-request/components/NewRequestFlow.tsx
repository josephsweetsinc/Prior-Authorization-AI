'use client';

import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import type { FormState } from '@/features/new-request';
import {
  setForm,
  clear,
  setExtractionResult,
} from '@/features/new-request/store/slice';
import {
  extractedToForm,
  formToExtracted,
  type IUploadAndExtractionResult,
  selectNewRequest,
  getErrorMessage,
  useCreateRequest,
} from '@/services/new-request';
import { TitleAndDesc, Window } from '@/shared/components';
import { Stepper } from '@/shared/components/stepper/stepper';
import { InfoStep } from '@/views/new-request/info-step';
import { ReviewStep } from '@/views/new-request/review-step';
import { UploadStep } from '@/views/new-request/upload-step';

import { TOTAL_STEPS } from '../constants';
import { useNewRequestFlow } from '../hooks/useNewRequestFlow';

export function NewRequestFlow() {
  const stored = useSelector(selectNewRequest);

  const dispatch = useDispatch();

  const handleExtractionReady = (data: IUploadAndExtractionResult) =>
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
    initialExtractedData: stored.extractedData,
    initialExtractionResult: stored.extractionResult,
    onExtractionReady: handleExtractionReady,
  });

  const { createRequest, isLoading: isCreating } = useCreateRequest();
  const router = useRouter();

  const reviewForm: Partial<FormState> | null =
    stored?.form ?? extractedToForm(extractedData);

  const handleCreate = async () => {
    try {
      await createRequest();

      dispatch(clear());

      toast(
        <div className='space-y-1'>
          <p className='text-black'>Request Successfully Created</p>
          <p className='text-gray-dark'>
            Your authorization request has been submitted and is now awaiting
            review.
          </p>
        </div>,
      );

      router.push('/');
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, 'Failed to create ambulance request'));
    }
  };

  const handleInfoNext = (res?: FormState | null) => {
    if (res) {
      dispatch(setForm(res));
    }
    next();
  };

  const handleReviewEditNext = (res?: FormState | null) => {
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
              stored?.form ? formToExtracted(stored.form) : extractedData
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
          form={reviewForm}
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
