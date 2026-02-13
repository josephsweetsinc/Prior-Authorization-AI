'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { UseFormSetError, FieldValues } from 'react-hook-form';
import { toast } from 'react-toastify';

import { handleParsedApiError } from '@/services/api/errorHandlers';
import { parseApiError } from '@/services/api/types';
import {
  usePasswordResetRequestMutation,
  usePasswordResetVerifyMutation,
} from '@/services/auth/api/auth-api-service';
import { Button, InputOTPControlled } from '@/shared/components';

export function EnterCodeForm() {
  const router = useRouter();

  const [seconds, setSeconds] = useState(57);
  const [isCounting, setIsCounting] = useState(true);
  const [code, setCode] = useState('');

  const [verify, { isLoading }] = usePasswordResetVerifyMutation();
  const [resendCode, { isLoading: isResending }] =
    usePasswordResetRequestMutation();

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isCounting) {
      interval = setInterval(() => {
        setSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsCounting(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isCounting]);

  const handleResend = async () => {
    if (seconds > 0 || isResending) {
      return;
    }

    const email =
      typeof window !== 'undefined'
        ? sessionStorage.getItem('password_reset_email')
        : null;

    if (!email) {
      toast.error(
        'Email not found. Please restart the password reset process.',
      );
      router.push('/forgot-password');
      return;
    }

    try {
      await resendCode({ email }).unwrap();
      toast.success('Reset code sent - check your email');
      setSeconds(57);
      setIsCounting(true);
    } catch (err: unknown) {
      const parsed = parseApiError(err);
      const dummySetError: UseFormSetError<FieldValues> = () => {};
      const handled = handleParsedApiError(parsed, dummySetError);
      if (!handled) {
        toast.error('Failed to resend code');
      }
    }
  };

  const onSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    try {
      if (!code || code.trim().length === 0) {
        toast.error('Please enter the verification code');
        return;
      }

      await verify({ code }).unwrap();
      router.push(`/create-new-password?code=${encodeURIComponent(code)}`);
    } catch (err: unknown) {
      const parsed = parseApiError(err);
      const dummySetError: UseFormSetError<FieldValues> = () => {};
      const handled = handleParsedApiError(parsed, dummySetError);
      if (!handled) {
        toast.error('Invalid or expired code');
      }
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
    <div className='w-full space-y-5'>
      <div>
        <InputOTPControlled value={code} onChangeAction={(v) => setCode(v)} />
      </div>

      <div className='pt-4'>
        <Button
          type='button'
          variant='primary'
          size='default'
          onClick={onSubmit}
          disabled={isLoading}
        >
          {isLoading ? 'Verifying...' : 'Create New Password'}
        </Button>
      </div>

      <div className='text-gray-dark mt-4 text-sm'>
        <div className='flex flex-col items-center justify-center'>
          <span>A code has been sent to your email</span>
          {seconds > 0 ? (
            <span className='mt-1 font-bold text-black'>
              Resend in {formatTime(seconds)}
            </span>
          ) : (
            <button
              type='button'
              onClick={handleResend}
              disabled={isResending}
              className='text-status-info mt-1 cursor-pointer underline'
            >
              {isResending ? 'Sending...' : 'Resend'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
