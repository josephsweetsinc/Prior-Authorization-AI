'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/shared/components/button';
import { Input } from '@/shared/components/inputs';
import { passwordSchema } from '@/shared/lib/validations/schemas';

const createNewPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: passwordSchema,
    token: z.string().optional(),
  })
  .superRefine((val, ctx) => {
    if (val.password !== val.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['confirmPassword'],
        message: 'Passwords do not match',
      });
    }
  });
type CreateNewPasswordSchema = z.infer<typeof createNewPasswordSchema>;

export function CreateNewPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tokenFromQuery = searchParams?.get('token') ?? undefined;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateNewPasswordSchema>({
    resolver: zodResolver(createNewPasswordSchema),
    defaultValues: { password: '', confirmPassword: '', token: tokenFromQuery },
  });

  const [_isSaving, setIsSaving] = useState(false);

  const onSubmit: SubmitHandler<CreateNewPasswordSchema> = async (data) => {
    setIsSaving(true);
    console.warn('Set new password', data);
    setTimeout(() => {
      setIsSaving(false);
      router.push('/login');
    }, 700);
  };

  return (
    <div className='w-full'>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        <Input
          label='Password'
          type='password'
          {...register('password')}
          error={errors.password?.message}
        />

        <Input
          label='Confirm password'
          type='password'
          {...register('confirmPassword')}
          error={errors.confirmPassword?.message}
        />

        <div className='pt-4'>
          <Button type='submit' variant='primary' size='default'>
            Create New Password
          </Button>
        </div>
      </form>
    </div>
  );
}
