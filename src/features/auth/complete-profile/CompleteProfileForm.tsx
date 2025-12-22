'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { z } from 'zod';

import { parseApiError } from '@/services/api/types';
import { useSignUp } from '@/services/auth/hooks';
import { Button } from '@/shared/components/button';
import { Input } from '@/shared/components/inputs';

export const completeProfileSchema = z.object({
  phone: z
    .string()
    .min(7, { message: 'Phone is required' })
    .refine((v) => /^1?\d{10}$/.test(v.replace(/\D/g, '')), {
      message:
        "Phone must be 10 digits (optionally prefixed with country code '1')",
    }),
  company: z.string().min(1, { message: 'Company is required' }),
  jobTitle: z.string().min(1, { message: 'Position is required' }),
});
export type CompleteProfileSchema = z.infer<typeof completeProfileSchema>;

export function CompleteProfileForm() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [serverErrors, setServerErrors] = useState<string | null>(null);

  const { signup, isLoading } = useSignUp();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CompleteProfileSchema>({
    resolver: zodResolver(completeProfileSchema),
    defaultValues: {
      phone: '',
      company: '',
      jobTitle: '',
    },
  });

  useEffect(() => {
    const step1 = sessionStorage.getItem('signup_step1');
    if (!step1) {
      router.push('/sign-up');
    }
  }, [router]);

  const onSubmit: SubmitHandler<CompleteProfileSchema> = async (data) => {
    setIsSaving(true);
    setServerErrors(null);

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
      const parsed = parseApiError(err);
      if (
        parsed.validation?.detail &&
        Array.isArray(parsed.validation.detail)
      ) {
        setServerErrors(parsed.validation.detail.map((d) => d.msg).join(', '));
      } else if (parsed.message) {
        setServerErrors(parsed.message);
      } else {
        setServerErrors('Signup failed');
      }
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
          {...register('phone')}
          error={errors.phone?.message}
        />

        <Input
          label='Position'
          type='text'
          {...register('jobTitle')}
          error={errors.jobTitle?.message}
        />

        <Input
          label='Place of Work'
          type='text'
          {...register('company')}
          error={errors.company?.message}
        />

        {serverErrors && (
          <div className='text-destructive text-sm'>{serverErrors}</div>
        )}

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
