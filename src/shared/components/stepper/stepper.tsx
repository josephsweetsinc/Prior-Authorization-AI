import { cn } from '@/shared/lib/utils';

interface StepperProps {
  currentStep: number;
  totalSteps?: number;
  className?: string;
}

export const Stepper = ({
  currentStep,
  totalSteps = 3,
  className,
}: StepperProps) => {
  return (
    <div className={cn('w-full', className)}>
      <div className='mb-1 text-lg font-medium text-[#A3AED0]'>
        Step {currentStep} of {totalSteps}
      </div>

      <div className='flex w-full gap-3'>
        {Array.from({ length: totalSteps }).map((_, index) => {
          const isActive = index + 1 <= currentStep;

          return (
            <div
              key={index}
              className={cn(
                'h-1 w-full rounded-full transition-colors duration-300',
                isActive ? 'bg-status-info' : 'bg-[#E8E8E8]',
              )}
            />
          );
        })}
      </div>
    </div>
  );
};
