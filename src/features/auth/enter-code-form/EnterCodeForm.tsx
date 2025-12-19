'use client';

import { useEffect, useState } from 'react';

import { Button, InputOTPControlled } from '@/shared/components';

export function EnterCodeForm() {
  const [isSent, setIsSent] = useState(true);
  const [seconds, setSeconds] = useState(57);
  const [isCounting, setIsCounting] = useState(true);

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

  const handleResend = () => {
    if (seconds === 0) {
      // TODO: call API to resend code
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
    <div className='w-full space-y-5'>
      <div>
        <InputOTPControlled />
      </div>

      <div className='pt-4'>
        <Button type='submit' variant='primary' size='default'>
          Create New Password
        </Button>
      </div>

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
