'use client';

import { useState } from 'react';

import { TitleAndDesc, Window } from '@/shared/components';
import { Stepper } from '@/shared/components/stepper/stepper';
import { InfoStep } from '@/views/new-request/info-step';
import { ReviewStep } from '@/views/new-request/review-step';
import { UploadStep } from '@/views/new-request/upload-step';

export function NewRequestFlow() {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
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
        {currentStep === 1 && <UploadStep onNext={handleNext} />}

        {currentStep === 2 && (
          <InfoStep onBack={handleBack} onNext={handleNext} />
        )}

        {currentStep === 3 && (
          <ReviewStep onBack={handleBack} onSubmit={() => alert('Submit!')} />
        )}
      </Window>
    </main>
  );
}
