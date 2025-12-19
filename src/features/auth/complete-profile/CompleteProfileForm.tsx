'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';

import { Button } from '@/shared/components/button';
import { Input } from '@/shared/components/inputs';
import {
  completeProfileSchema,
  type CompleteProfileSchema,
} from '@/shared/lib/validations/auth';

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
    // TODO: call API to save profile data
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
