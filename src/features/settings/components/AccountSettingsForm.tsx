'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useRef, useState } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { useGetCurrentUserQuery } from '@/services/auth/api/auth-api-service';
import { useUpdateUserAccountMutation } from '@/services/settings/api';
import { Button } from '@/shared/components/button';
import { Input } from '@/shared/components/inputs';
import { useApiFormError } from '@/shared/hooks/useApiFormError';
import {
  createPhoneInputChangeHandler,
  formatPhoneNumber,
} from '@/shared/lib/formatters/phone';

import { type UpdateAccountSchema, updateAccountSchema } from '../validation';

export const AccountSettingsForm = () => {
  const { data: currentUser, refetch } = useGetCurrentUserQuery();
  const lastPhoneDigitsRef = useRef('');

  const {
    register,
    handleSubmit,
    reset,
    setError,
    setValue,
    formState: { errors },
  } = useForm<UpdateAccountSchema>({
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
  const { handleError } = useApiFormError<UpdateAccountSchema>(setError);
  const handlePhoneChange = createPhoneInputChangeHandler({
    setValue,
    lastDigitsRef: lastPhoneDigitsRef,
  });

  useEffect(() => {
    if (currentUser) {
      const phoneNumber = currentUser.phone_number ?? '';
      const formattedPhone = phoneNumber ? formatPhoneNumber(phoneNumber) : '';

      reset({
        name: currentUser.name ?? '',
        surname: currentUser.surname ?? '',
        email: currentUser.email ?? '',
        phone: formattedPhone,
        position: currentUser.position ?? '',
        place_of_work: currentUser.place_of_work ?? '',
      });

      lastPhoneDigitsRef.current = phoneNumber.replace(/\D/g, '');
    }
  }, [currentUser, reset]);

  const onSubmit: SubmitHandler<UpdateAccountSchema> = async (data) => {
    setIsUpdating(true);
    try {
      await updateUserAccount(data).unwrap();
      await refetch();
      toast.success('Account updated successfully');
    } catch (error) {
      handleError(error);
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
