'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/shared/components/button';
import { Input } from '@/shared/components/inputs';
import { emailSchema } from '@/shared/lib/validations/schemas';

const forgotPasswordSchema = z.object({
  email: emailSchema,
});
type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
  const { register, handleSubmit, formState } = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });
  const { errors } = formState;

  const [_isSent, setIsSent] = useState(false);
  const [_seconds, setSeconds] = useState(57);
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
    </div>
  );
}
