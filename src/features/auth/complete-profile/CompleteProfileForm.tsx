'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/shared/components/button';
import { Input } from '@/shared/components/inputs';
import { phonePattern } from '@/shared/lib/validations/schemas';
export const completeProfileSchema = z.object({
  phone: z
    .string()
    .min(7, { message: 'Phone is required' })
    .refine((v) => phonePattern.test(v), { message: 'Invalid phone number' }),
  company: z.string().min(1, { message: 'Company is required' }),
  jobTitle: z.string().min(1, { message: 'Position is required' }),
});
export type CompleteProfileSchema = z.infer<typeof completeProfileSchema>;

export function CompleteProfileForm() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

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

  const onSubmit: SubmitHandler<CompleteProfileSchema> = async (data) => {
    setIsSaving(true);
    console.warn('Complete profile:', data);
    setTimeout(() => {
      setIsSaving(false);
      router.push('/');
    }, 700);
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

        <div className='pt-2'>
          <Button
            type='submit'
            variant='primary'
            size='default'
            disabled={isSaving}
          >
            Create Account
          </Button>
        </div>
      </form>
    </div>
  );
}
