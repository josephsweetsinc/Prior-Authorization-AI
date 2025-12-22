'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();

  const { register, handleSubmit, formState, setError } =
    useForm<ForgotPasswordSchema>({
      resolver: zodResolver(forgotPasswordSchema),
      defaultValues: { email: '' },
    });
  const { errors } = formState;

  const [passwordResetRequest, { isLoading }] =
    usePasswordResetRequestMutation();

  const onSubmit: SubmitHandler<ForgotPasswordSchema> = async (data) => {
    try {
      await passwordResetRequest({ email: data.email }).unwrap();
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('password_reset_email', data.email);
      }
      toast.success('Reset code sent - check your email');
      router.push('/forgot-password/enter-code');
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
      </form>
    </div>
  );
}
