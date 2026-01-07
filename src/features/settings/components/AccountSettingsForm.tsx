'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { parseApiError } from '@/services/api/types';
import { useGetCurrentUserQuery } from '@/services/auth/api/auth-api-service';
import { useUpdateUserAccountMutation } from '@/services/settings/api';
import { Button } from '@/shared/components/button';
import { Input } from '@/shared/components/inputs';

import { type UpdateAccountSchema, updateAccountSchema } from '../validation';

export const AccountSettingsForm = () => {
  const { data: currentUser } = useGetCurrentUserQuery();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(updateAccountSchema),
    defaultValues: {
      name: '',
      surname: '',
      email: '',
      phone: '',
      position: '',
      place_of_work: '',
    },
  });

  const [updateUserAccount] = useUpdateUserAccountMutation();
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (currentUser) {
      reset({
        name: currentUser.name ?? '',
        surname: currentUser.surname ?? '',
        email: currentUser.email ?? '',
        phone: currentUser.phone_number ?? '',
        position: currentUser.position ?? '',
        place_of_work: currentUser.place_of_work ?? '',
      });
    }
  }, [currentUser, reset]);

  const onSubmit: SubmitHandler<UpdateAccountSchema> = async (data) => {
    setIsUpdating(true);
    try {
      await updateUserAccount(data).unwrap();
      toast.success('Account updated successfully');
    } catch (error) {
      const parsedError = parseApiError(error)?.message;
      toast.error(parsedError ?? 'Failed to update account');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <form className='grid grid-cols-2 gap-5' onSubmit={handleSubmit(onSubmit)}>
      <Input
        labelVariant='static'
        label='First Name'
        {...register('name')}
        error={errors.name?.message}
      />
      <Input
        labelVariant='static'
        label='Last Name'
        {...register('surname')}
        error={errors.surname?.message}
      />
      <Input
        labelVariant='static'
        label='Email'
        {...register('email')}
        error={errors.email?.message}
      />
      <Input
        labelVariant='static'
        label='Phone'
        {...register('phone')}
        error={errors.phone?.message}
      />
      <Input
        labelVariant='static'
        label='Position'
        {...register('position')}
        error={errors.position?.message}
      />
      <Input
        labelVariant='static'
        label='Place of Work'
        {...register('place_of_work')}
        error={errors.place_of_work?.message}
      />
      <div className='col-span-2 flex justify-end pt-3'>
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
};
