import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, type HTMLProps } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { Input, Select } from '@/shared/components';
import { cn } from '@/shared/lib/utils';

import { ROLE_OPTIONS } from '../constants';
import { type IUpdateFormData } from '../types';
import { updateUserSchema } from '../validation';

type Props = {
  onSubmit: (_data: IUpdateFormData) => void;
  onCancel: VoidFunction;
  defaults: IUpdateFormData;
} & Omit<HTMLProps<HTMLFormElement>, 'onSubmit' | 'method'>;

export const UpdateUserForm = ({
  onSubmit,
  defaults,
  className,
  ...props
}: Props) => {
  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
    reset,
  } = useForm<IUpdateFormData>({
    defaultValues: defaults,
    resolver: zodResolver(updateUserSchema),
  });

  useEffect(() => {
    reset(defaults);
  }, [defaults, reset]);

  return (
    <form
      className={cn('space-y-4', className)}
      {...props}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className='flex gap-3'>
        <Input
          type='text'
          label='First name'
          labelVariant='static'
          error={errors['name'] ? errors['name'].message : null}
          placeholder='Enter Name'
          {...register('name')}
        />

        <Input
          type='text'
          label='Last name'
          labelVariant='static'
          error={errors['surname'] ? errors['surname'].message : null}
          placeholder='Enter Last Name'
          {...register('surname')}
        />
      </div>
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
    </form>
  );
};
