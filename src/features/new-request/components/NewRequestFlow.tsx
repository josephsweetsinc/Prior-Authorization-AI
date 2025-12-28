'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import {
  setExtractionResult,
  setForm,
  type NewRequestState,
} from '@/features/new-request/helpers/newRequestSlice';
import type { FormState } from '@/features/new-request/info-form/types/types';
import { useCreateRequest } from '@/services/new-request/hook/useCreateRequest';
import { TitleAndDesc, Window } from '@/shared/components';
import { Stepper } from '@/shared/components/stepper/stepper';
import type { RootState } from '@/store';
import { InfoStep } from '@/views/new-request/info-step';
import { ReviewStep } from '@/views/new-request/review-step';
import { UploadStep } from '@/views/new-request/upload-step';

export function NewRequestFlow() {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
  const stored = useSelector(
    (s: RootState) => s.newRequest as NewRequestState | undefined,
  );
  const [extractedData, setExtractedData] = useState<Record<
    string,
    unknown
  > | null>(stored?.extractedData ?? null);
  const [extractionResult, setExtractionResultState] = useState<Record<
    string,
    unknown
  > | null>(stored?.extractionResult ?? null);
  const dispatch = useDispatch();
  const [isReviewEditing, setIsReviewEditing] = useState(false);
  const { createRequest, isLoading: isCreating } = useCreateRequest();

  const handleNext = (extraction?: Record<string, unknown> | null) => {
    if (extraction) {
      const extracted =
        (extraction as Record<string, unknown>)?.extracted_data ?? null;
      setExtractedData(extracted as Record<string, unknown> | null);
      setExtractionResultState(extraction ?? null);
      try {
        const safe = JSON.parse(JSON.stringify(extraction ?? null));
        dispatch(setExtractionResult(safe));
      } catch {
        dispatch(setExtractionResult(extraction ?? null));
      }
    }

    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  function mapExtractedToFormState(
    v?: Record<string, unknown> | null,
  ): FormState | null {
    if (!v) {
      return null;
    }

    return {
      transportationType: String(v.transportation_type ?? ''),
      patientFirstName: String(v.patient_first_name ?? ''),
      patientLastName: String(v.patient_last_name ?? ''),
      patientDob: String(v.patient_date_of_birth ?? ''),
      patientId: String(v.patient_id ?? ''),
      dateOfTransport: String(v.date_of_transport ?? ''),
      timeOfTransport: String(v.time_of_transport ?? ''),
      pickupAddress: String(v.pickup_address ?? ''),
      destinationAddress: String(v.destination_address ?? ''),
      primaryDiagnosis: String(v.primary_diagnosis ?? ''),
      medicalJustification: String(v.medical_justification ?? ''),
      formNumber: String(v.form_number ?? ''),
    } as FormState;
  }

  function mapFormStateToExtracted(
    f?: FormState | null,
  ): Record<string, unknown> | null {
    if (!f) {
      return null;
    }

    return {
      transportation_type: f.transportationType,
      patient_first_name: f.patientFirstName,
      patient_last_name: f.patientLastName,
      patient_date_of_birth: f.patientDob,
      patient_id: f.patientId,
      date_of_transport: f.dateOfTransport,
      time_of_transport: f.timeOfTransport,
      pickup_address: f.pickupAddress,
      destination_address: f.destinationAddress,
      primary_diagnosis: f.primaryDiagnosis,
      medical_justification: f.medicalJustification,
      form_number: f.formNumber,
    };
  }

  const reviewForm: FormState | null =
    (stored?.form as FormState | null) ??
    mapExtractedToFormState(extractedData);

  const handleCreate = async () => {
    try {
      await createRequest();
      toast.success('Ambulance request created successfully');
    } catch (err: unknown) {
      let msg = 'Failed to create ambulance request';

      if (err && typeof err === 'object') {
        const maybeErr = err as {
          data?: {
            message?: unknown;
          };
          message?: unknown;
        };

        if (
          maybeErr.data &&
          typeof maybeErr.data === 'object' &&
          typeof maybeErr.data.message === 'string'
        ) {
          msg = maybeErr.data.message as string;
        } else if (typeof maybeErr.message === 'string') {
          msg = maybeErr.message as string;
        }
      }

      toast.error(msg);

      // Log the raw error for debugging
      console.error('create request error', err);
    }
  };

  return (
    <main>
      <TitleAndDesc
        title='Create New Request'
        subtitle='Enter transportation details, patient information and attach required medical documents.'
      />

      <Stepper
        currentStep={currentStep}
        totalSteps={totalSteps}
        className='mt-6 mb-4'
      />

      <Window>
        {currentStep === 1 ? (
          <UploadStep onNext={handleNext} />
        ) : currentStep === 2 ? (
          <InfoStep
            onBack={handleBack}
            onNext={(res) => {
              if (res) {
                dispatch(setForm(res));
              }

              handleNext();
            }}
            initialValues={extractedData}
            isComplete={Boolean(extractionResult?.is_complete)}
          />
        ) : currentStep === 3 ? (
          isReviewEditing ? (
            <InfoStep
              onBack={() => setIsReviewEditing(false)}
              onNext={(res) => {
                if (res) {
                  dispatch(setForm(res));
                }

                setIsReviewEditing(false);
              }}
              initialValues={
                (stored?.form as FormState | null)
                  ? mapFormStateToExtracted(stored?.form as FormState)
                  : extractedData
              }
              mode='review-edit'
              isComplete={Boolean(extractionResult?.is_complete)}
            />
          ) : (
            <ReviewStep
              onBack={handleBack}
              onSubmit={handleCreate}
              onEdit={() => setIsReviewEditing(true)}
              form={reviewForm ?? undefined}
              isSubmitting={isCreating}
            />
          )
        ) : null}
      </Window>
    </main>
  );
}
