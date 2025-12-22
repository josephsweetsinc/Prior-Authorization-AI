'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { toast } from 'react-toastify';
import { z } from 'zod';

import { handleParsedApiError } from '@/services/api/errorHandlers';
import { parseApiError } from '@/services/api/types';
import { usePasswordResetRequestMutation } from '@/services/auth/api/auth-api-service';
import { Button } from '@/shared/components/button';
import { Input } from '@/shared/components/inputs';
import { emailSchema } from '@/shared/lib/validations/schemas';

const forgotPasswordSchema = z.object({
  email: emailSchema,
});
type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
  const { register, handleSubmit, formState, setError, getValues } =
    useForm<ForgotPasswordSchema>({
      resolver: zodResolver(forgotPasswordSchema),
      defaultValues: { email: '' },
    });
  const { errors } = formState;

  const [isSent, setIsSent] = useState(false);
  const [seconds, setSeconds] = useState(57);
  const [isCounting, setIsCounting] = useState(false);

  const [passwordResetRequest, { isLoading }] =
    usePasswordResetRequestMutation();

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (isCounting) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => {
          if (prevSeconds <= 1) {
            if (interval) {
              clearInterval(interval);
            }
            setIsCounting(false);
            return 0;
          }
          return prevSeconds - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isCounting]);

  const formatTime = (s: number) => {
    const mm = Math.floor(s / 60)
      .toString()
      .padStart(2, '0');
    const ss = (s % 60).toString().padStart(2, '0');
    return `${mm}:${ss}`;
  };

  const onSubmit: SubmitHandler<ForgotPasswordSchema> = async (data) => {
    try {
      await passwordResetRequest({ email: data.email }).unwrap();
      setIsSent(true);
      setSeconds(57);
      setIsCounting(true);
      toast.success('Reset code sent - check your email');
    } catch (err: unknown) {
      const parsed = parseApiError(err);
      const handled = handleParsedApiError(parsed, setError);
      if (!handled) {
        toast.error('Something went wrong');
      }
    }
  };

  const handleResend = async () => {
    try {
      const currentEmail = getValues('email');
      await passwordResetRequest({ email: currentEmail ?? '' }).unwrap();
      setIsSent(true);
      setSeconds(57);
      setIsCounting(true);
    } catch (err: unknown) {
      const parsed = parseApiError(err);
      const handled = handleParsedApiError(parsed, setError);
      if (!handled) {
        toast.error('Something went wrong');
      }
    }
  };

  return (
    <div className='w-full'>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        <Input
          label='Email'
          type='email'
          {...register('email')}
          error={errors.email?.message}
        />

        <div className='pt-2'>
          <Button
            type='submit'
            variant='primary'
            size='default'
            disabled={isLoading}
          >
            Send reset link
          </Button>
        </div>

        <div className='text-muted-foreground mt-3 text-sm'>
          <span>A code has been sent to your email</span>
          <div className='mt-1'>
            {isSent ? (
              isCounting && seconds > 0 ? (
                <span>Resend in {formatTime(seconds)}</span>
              ) : (
                <button
                  type='button'
                  className='text-primary ml-1 text-sm underline'
                  onClick={handleResend}
                >
                  Resend
                </button>
              )
            ) : null}
          </div>
        </div>
      </form>
    </div>
  );
}
