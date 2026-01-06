'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { z } from 'zod';

import { parseApiError } from '@/services/api/types';
import { useGetCurrentUserQuery } from '@/services/auth/api/auth-api-service';
import { useUpdateUserOrganizationMutation } from '@/services/settings/api';
import { Button } from '@/shared/components/button';
import { Input } from '@/shared/components/inputs';

const updateOrganizationSchema = z.object({
  provider_type: z.string().nonempty({ message: 'Provider type is required' }),
  professional_id: z
    .string()
    .nonempty({ message: 'Professional ID is required' }),
  medic_name: z.string().nonempty({ message: 'Medic name is required' }),
});

type UpdateOrganizationSchema = z.infer<typeof updateOrganizationSchema>;

export const OrganizationSettingsForm = () => {
  const { data: currentUser } = useGetCurrentUserQuery();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(updateOrganizationSchema),
    defaultValues: {
      provider_type: '',
      professional_id: '',
      medic_name: '',
    },
  });

  const [updateUserOrganization] = useUpdateUserOrganizationMutation();
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (currentUser?.organization) {
      reset({
        provider_type: currentUser.organization?.provider_type ?? '',
        professional_id: currentUser.organization?.professional_id ?? '',
        medic_name: currentUser.organization?.medic_name ?? '',
      });
    }
  }, [currentUser, reset]);

  const onSubmit: SubmitHandler<UpdateOrganizationSchema> = async (data) => {
    setIsUpdating(true);
    try {
      await updateUserOrganization(data).unwrap();
      toast.success('Organization updated successfully');
    } catch (error) {
      const parsed = parseApiError(error);
      toast.error(parsed?.message ?? 'Failed to update organization');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <form className='space-y-5' onSubmit={handleSubmit(onSubmit)}>
      <Input
        labelVariant='static'
        label='Provider Type'
        placeholder='Provider type'
        {...register('provider_type')}
        error={errors.provider_type?.message}
      />

      <Input
        labelVariant='static'
        label='Professional ID'
        placeholder='Professional ID'
        {...register('professional_id')}
        error={errors.professional_id?.message}
      />

      <Input
        labelVariant='static'
        label='Medic Name'
        placeholder='Medic name'
        {...register('medic_name')}
        error={errors.medic_name?.message}
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
};
