import { zodResolver } from '@hookform/resolvers/zod';
import { type HTMLProps } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { Input, Select } from '@/shared/components';
import { cn } from '@/shared/lib/utils';

import { ROLE_OPTIONS } from '../constants';
import { type ICreateFormData } from '../types';
import { createUserSchema } from '../validation';

type Props = {
  // eslint-disable-next-line no-unused-vars
  onSubmit: (data: ICreateFormData) => void;
  onCancel: VoidFunction;
  defaults: ICreateFormData;
} & Omit<HTMLProps<HTMLFormElement>, 'onSubmit' | 'method'>;

export const CreateUserForm = ({ onSubmit, className, ...props }: Props) => {
  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = useForm<ICreateFormData>({ resolver: zodResolver(createUserSchema) });

  return (
    <form
      className={cn('space-y-4', className)}
      {...props}
      onSubmit={handleSubmit(onSubmit)}
    >
      <Input
        type='text'
        label='Full Name'
        labelVariant='static'
        error={errors['fullName'] ? errors['fullName'].message : null}
        placeholder='Enter Name'
        {...register('fullName')}
      />
      <Input
        type='email'
        label='Email Address'
        labelVariant='static'
        error={errors['email'] ? errors['email'].message : null}
        placeholder='Enter Email'
        {...register('email')}
      />
      <Controller
        control={control}
        name='role'
        render={({ field }) => (
          <Select
            label='Role'
            placeholder='Select Role'
            error={errors['role'] ? errors['role'].message : null}
            options={ROLE_OPTIONS}
            aria-invalid={true}
            {...field}
          />
        )}
      />
      <Input
        type='password'
        label='Password'
        labelVariant='static'
        error={errors['password'] ? errors['password'].message : null}
        placeholder='Enter password'
        {...register('password')}
      />
    </form>
  );
};
