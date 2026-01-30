'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { useUpdatePasswordMutation } from '@/services/auth/api/auth-api-service';
import { Button } from '@/shared/components/button';
import { Input } from '@/shared/components/inputs';
import { useApiFormError } from '@/shared/hooks/useApiFormError';

import { type UpdatePasswordSchema, updatePasswordSchema } from '../validation';

export function SecuritySettingsForm() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<UpdatePasswordSchema>({
    resolver: zodResolver(updatePasswordSchema),
  });

  const [updatePassword] = useUpdatePasswordMutation();
  const [isUpdating, setIsUpdating] = useState(false);
  const { handleError } = useApiFormError<UpdatePasswordSchema>(setError);

  const onSubmit: SubmitHandler<UpdatePasswordSchema> = async (data) => {
    setIsUpdating(true);
    try {
      await updatePassword(data).unwrap();
      toast.success('Password updated successfully');
    } catch (error) {
      handleError(error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
      <Input
        labelVariant='static'
        label='Current Password'
        type='password'
        placeholder='Enter password'
        {...register('old_password')}
        error={errors.old_password?.message}
      />
      <Input
        labelVariant='static'
        label='New Password'
        type='password'
        placeholder='Enter password'
        {...register('new_password')}
        error={errors.new_password?.message}
      />

      <Input
        labelVariant='static'
        label='Confirm Password'
        type='password'
        placeholder='Confirm password'
        {...register('confirmPassword')}
        error={errors.confirmPassword?.message}
      />
      <div className='flex justify-end pt-3'>
        <Button
          variant='primary'
          size='default'
          className='w-fit'
          type='submit'
          disabled={isUpdating}
        >
          {isUpdating ? 'Updating...' : 'Update Information'}
        </Button>
      </div>
    </form>
  );
}
