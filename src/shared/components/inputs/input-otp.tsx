'use client';

import { OTPInput, OTPInputContext } from 'input-otp';
import * as React from 'react';

import { cn } from '@/shared/lib/utils';

export function InputOTPControlled({
  value: controlledValue,
  onChangeAction,
}: {
  value?: string;
  onChangeAction?: (_value: string) => void;
}) {
  const [internalValue, setInternalValue] = React.useState('');
  const value = controlledValue ?? internalValue;
  const setValue = (val: string) => {
    if (onChangeAction) {
      onChangeAction(val);
    } else {
      setInternalValue(val);
    }
  };

  return (
    <div className='flex w-full content-center justify-center space-y-2'>
      <InputOTP maxLength={6} value={value} onChange={(v) => setValue(v)}>
        <InputOTPGroup className='flex content-center justify-center gap-9'>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
        </InputOTPGroup>
      </InputOTP>
    </div>
  );
}

function InputOTP({
  className,
  containerClassName,
  ...props
}: React.ComponentProps<typeof OTPInput> & {
  containerClassName?: string;
}) {
  return (
    <OTPInput
      data-slot='input-otp'
      containerClassName={cn(
        'flex items-center gap-2 has-disabled:opacity-50',
        containerClassName,
      )}
      className={cn('disabled:cursor-not-allowed', className)}
      {...props}
    />
  );
}

function InputOTPGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='input-otp-group'
      className={cn('flex w-full items-center', className)}
      {...props}
    />
  );
}

function InputOTPSlot({
  index,
  className,
  ...props
}: React.ComponentProps<'div'> & {
  index: number;
}) {
  const inputOTPContext = React.useContext(OTPInputContext);
  const { char, hasFakeCaret, isActive } = inputOTPContext?.slots[index] ?? {};

  return (
    <div
      data-slot='input-otp-slot'
      data-active={isActive}
      className={cn(
        `text-foreground border-muted-foreground data-[active=true]:border-accent-foreground aria-invalid:border-destructive relative flex h-20 w-20 items-center justify-center border-b-2 text-xl font-medium transition-colors`,
        className,
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className='pointer-events-none absolute inset-0 flex items-center justify-center'>
          <div className='animate-caret-blink bg-foreground h-4 w-px duration-1000' />
        </div>
      )}
    </div>
  );
}

export { InputOTP, InputOTPGroup, InputOTPSlot };
