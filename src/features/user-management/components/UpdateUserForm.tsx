import { type HTMLProps } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { Input, Select } from '@/shared/components';
import { cn } from '@/shared/lib/utils';

import { ROLE_OPTIONS } from '../constants';
import { type IFormData } from '../types';

type Props = {
  // eslint-disable-next-line no-unused-vars
  onSubmit: (data: IFormData) => void;
  onCancel: VoidFunction;
  defaults: IFormData;
} & Omit<HTMLProps<HTMLFormElement>, 'onSubmit' | 'method'>;

export const UpdateUserForm = ({ onSubmit, className, ...props }: Props) => {
  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = useForm<IFormData>();

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
        {...register('fullName', {
          required: 'Full name is required field',
        })}
      />
      <Input
        type='email'
        label='Email Address'
        labelVariant='static'
        error={errors['email'] ? errors['email'].message : null}
        placeholder='Enter Email'
        {...register('email', {
          required: 'Email is required field',
          pattern: {
            value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
            message: 'Invalid email address',
          },
        })}
      />
      <Controller
        control={control}
        name='role'
        rules={{ required: 'Role is required field' }}
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
    </form>
  );
};
