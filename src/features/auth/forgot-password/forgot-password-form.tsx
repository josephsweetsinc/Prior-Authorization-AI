'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';

import { Button } from '@/shared/components/button';
import { Input } from '@/shared/components/inputs';
import {
  forgotPasswordSchema,
  type ForgotPasswordSchema,
} from '@/shared/lib/validations/auth';

export function ForgotPasswordForm() {
  const { register, handleSubmit, formState } = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });
  const { errors } = formState;

  const [isSent, setIsSent] = useState(false);
  const [seconds, setSeconds] = useState(57);
  const [isCounting, setIsCounting] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isCounting) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => {
          if (prevSeconds <= 1) {
            clearInterval(interval);
            setIsCounting(false);
            return 0;
          }
          return prevSeconds - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isCounting]);

  const onSubmit: SubmitHandler<ForgotPasswordSchema> = async (data) => {
    console.warn('Send reset link to:', data.email);
    setIsSent(true);
    setSeconds(57);
    setIsCounting(true);
  };

  const handleResend = () => {
    if (seconds === 0) {
      console.warn('Resend reset link');
      setIsSent(true);
      setSeconds(57);
      setIsCounting(true);
    }
  };

  const formatTime = (s: number) => {
    const mm = Math.floor(s / 60)
      .toString()
      .padStart(2, '0');
    const ss = (s % 60).toString().padStart(2, '0');
    return `${mm}:${ss}`;
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
          <Button type='submit' variant='primary' size='default'>
            Send reset link
          </Button>
        </div>
      </form>

      <div className='mt-4 text-sm text-[#4A5568]'>
        {isSent ? (
          <div className='flex flex-col items-center justify-center'>
            <span>A code has been sent to your email</span>
            {seconds > 0 ? (
              <span className='mt-1 font-bold text-[#232323]'>
                Resend in {formatTime(seconds)}
              </span>
            ) : (
              <button
                type='button'
                onClick={handleResend}
                className='mt-1 cursor-pointer text-[#047CB4] underline'
              >
                Resend
              </button>
            )}
          </div>
        ) : (
          <div className='text-muted-foreground text-center'>
            A code will be sent to your email after you click Send reset link
          </div>
        )}
      </div>
    </div>
  );
}
