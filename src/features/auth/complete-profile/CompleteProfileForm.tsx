'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { z } from 'zod';

import { useSignUp } from '@/services/auth/hooks';
import { Button } from '@/shared/components/button';
import { Input } from '@/shared/components/inputs';
import { useApiFormError } from '@/shared/hooks/useApiFormError';
import { createPhoneInputChangeHandler } from '@/shared/lib/formatters/phone';

export const completeProfileSchema = z.object({
  phone: z
    .string()
    .min(1, { message: 'Phone is required' })
    .refine((v) => /^1\d{10}$/.test(v.replace(/\D/g, '')), {
      message: "Phone must be 11 digits starting with '1'",
    }),
  company: z
    .string()
    .min(1, { message: 'Company is required' })
    .max(40, { message: 'Company must be 40 characters or less' }),
  jobTitle: z
    .string()
    .min(1, { message: 'Position is required' })
    .max(40, { message: 'Position must be 40 characters or less' }),
});
export type CompleteProfileSchema = z.infer<typeof completeProfileSchema>;

export function CompleteProfileForm() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const lastPhoneDigitsRef = useRef('');

  const { signup, isLoading } = useSignUp();

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors },
  } = useForm<CompleteProfileSchema>({
    resolver: zodResolver(completeProfileSchema),
    defaultValues: {
      phone: '',
      company: '',
      jobTitle: '',
    },
  });

  const { handleError } = useApiFormError(setError);
  const handlePhoneChange = createPhoneInputChangeHandler({
    setValue,
    lastDigitsRef: lastPhoneDigitsRef,
  });

  useEffect(() => {
    const step1 = sessionStorage.getItem('signup_step1');
    if (!step1) {
      router.push('/sign-up');
    }
  }, [router]);

  const onSubmit: SubmitHandler<CompleteProfileSchema> = async (data) => {
    setIsSaving(true);

    try {
      const step1Raw = sessionStorage.getItem('signup_step1');
      if (!step1Raw) {
        router.push('/sign-up');
        return;
      }
      const step1 = JSON.parse(step1Raw) as {
        name: string;
        surname: string;
        email: string;
        password: string;
      };

      const digits = data.phone.replace(/\D/g, '');
      let normalizedPhone = digits;
      if (digits.length === 10) {
        normalizedPhone = `1${digits}`;
      }

      const payload = {
        name: step1.name,
        surname: step1.surname,
        email: step1.email,
        password: step1.password,
        phone_number: normalizedPhone,
        position: data.jobTitle,
        place_of_work: data.company,
      };

      await signup(payload);

      sessionStorage.removeItem('signup_step1');
      router.push('/');
    } catch (err: unknown) {
      handleError(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className='w-full'>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
        <Input
          label='Phone Number'
          type='tel'
          inputMode='numeric'
          autoComplete='tel'
          maxLength={18}
          placeholder='+1 (234) 567-8900'
          {...register('phone', {
            onChange: handlePhoneChange,
          })}
          error={errors.phone?.message}
        />

        <Input
          label='Position'
          type='text'
          maxLength={40}
          {...register('jobTitle')}
          error={errors.jobTitle?.message}
        />

        <Input
          label='Place of Work'
          type='text'
          maxLength={40}
          {...register('company')}
          error={errors.company?.message}
        />

        <div className='pt-2'>
          <Button
            type='submit'
            variant='primary'
            size='default'
            disabled={isSaving || isLoading}
          >
            {isSaving || isLoading ? 'Creating...' : 'Create Account'}
          </Button>
        </div>
      </form>
    </div>
  );
}
