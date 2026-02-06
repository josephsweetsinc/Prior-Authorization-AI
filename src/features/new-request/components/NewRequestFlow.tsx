'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
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
  type IUploadAndExtractionResult,
  selectNewRequest,
  getErrorMessage,
  useCreateRequest,
} from '@/services/new-request';
import { useGetRequestDetailsQuery } from '@/services/requests';
import { TitleAndDesc, Window } from '@/shared/components';
import { Stepper } from '@/shared/components/stepper/stepper';
import { InfoStep } from '@/views/new-request/info-step';
import { ReviewStep } from '@/views/new-request/review-step';
import { UploadStep } from '@/views/new-request/upload-step';

import { TOTAL_STEPS } from '../constants';
import { useHydrateDraft } from '../hooks/useHydrateDraft';
import { useNewRequestFlow } from '../hooks/useNewRequestFlow';
import { resolveInitialValues } from '../utils/resolvers';
import { transformRequestToExtraction } from '../utils/transform';

import { InfoStepSkeleton } from './InfoStepSkeleton';

interface Props {
  draftId?: number;
}

export function NewRequestFlow({ draftId }: Props) {
  const {
    data: draft,
    isSuccess,
    isLoading,
  } = useGetRequestDetailsQuery(draftId!, {
    skip: !draftId,
  });
  const stored = useSelector(selectNewRequest);

  const dispatch = useDispatch();

  const draftExtractionResult = transformRequestToExtraction(draft);

  useHydrateDraft({ draft: draftExtractionResult, isSuccess });

  const handleExtractionReady = (data: IUploadAndExtractionResult) =>
    dispatch(setExtractionResult(data));

  const {
    step,
    next,
    prev,
    reset,
    isReviewEditing,
    startReviewEdit,
    finishReviewEdit,
    extractedData,
    extractionResult,
  } = useNewRequestFlow({
    totalSteps: TOTAL_STEPS,
    initialStep: draftId ? 2 : 1,
    initialExtractedData: stored.extractedData,
    initialExtractionResult: stored.extractionResult,
    onExtractionReady: handleExtractionReady,
  });

  const { createRequest, isLoading: isCreating } = useCreateRequest();
  const router = useRouter();
  const searchParams = useSearchParams();

  const reviewForm: Partial<FormState> | null =
    stored?.form ?? extractedToForm(extractedData);

  const overallStatus = extractionResult?.completion_status?.overall_status;

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

  const handleInfoPrev = (res?: Partial<FormState> | null) => {
    if (res) {
      dispatch(clear());
    }
    prev();
  };

  const handleInfoNext = (res?: Partial<FormState> | null) => {
    if (res) {
      dispatch(setForm(res));
    }
    next();
  };

  const handleReviewEditNext = (res?: Partial<FormState> | null) => {
    if (res) {
      dispatch(setForm(res));
    }
    finishReviewEdit();
  };

  const startParam = searchParams.get('start');

  useEffect(() => {
    if (startParam !== '1') {
      return;
    }

    if (step !== 1) {
      dispatch(clear());
      reset();
    }

    router.replace('/new-request');
  }, [dispatch, reset, router, startParam, step]);

  function renderStep() {
    if (step === 1) {
      return <UploadStep onNext={next} />;
    }

    if (step === 2) {
      if (draftId && isLoading) {
        return <InfoStepSkeleton />;
      }

      return (
        <InfoStep
          onBack={handleInfoPrev}
          onNext={handleInfoNext}
          initialValues={resolveInitialValues({
            extractedData,
            storedForm: stored?.form,
            draftExtractionResult,
            includeDraft: true,
          })}
          overallStatus={overallStatus}
          hideBackButton={isSuccess ? true : false}
        />
      );
    }

    if (step === 3) {
      if (isReviewEditing) {
        return (
          <InfoStep
            onBack={finishReviewEdit}
            onNext={handleReviewEditNext}
            initialValues={resolveInitialValues({
              extractedData,
              storedForm: stored?.form,
              draftExtractionResult,
              includeDraft: false,
            })}
            mode='review-edit'
            overallStatus={overallStatus}
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
