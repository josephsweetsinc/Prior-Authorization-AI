'use client';

import { Building2, Camera, Mail, Phone, SquarePen } from 'lucide-react';
import { type ChangeEvent, useId } from 'react';
import { toast } from 'react-toastify';

import { useUploadAvatarMutation } from '@/services/auth/api/auth-api-service';
import { Avatar, Button, Chip, Window } from '@/shared/components';

type Props = {
  name: string;
  role: string;
  email: string;
  phone: string;
  organization: string;
  avatarUrl?: string | null;
  onEditClick?: () => void;
};

export const ProfileHeaderCard = ({
  name,
  role,
  email,
  phone,
  organization,
  avatarUrl,
  onEditClick,
}: Props) => {
  const inputId = useId();
  const [uploadAvatar, { isLoading: isUploading }] = useUploadAvatarMutation();

  const handleAvatarChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) {
      return;
    }

    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      toast.error('Only JPG or PNG files are allowed.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Avatar must be 5MB or less.');
      return;
    }

    try {
      await uploadAvatar(file).unwrap();
    } catch (error) {
      toast.error('Failed to upload avatar. Please try again.');
    }
  };

  return (
    <Window className='p-6'>
      <div className='flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between'>
        <div className='flex w-full flex-col gap-6 md:flex-row md:items-center'>
          <label
            className='relative inline-flex shrink-0 cursor-pointer'
            htmlFor={inputId}
            aria-label='Upload avatar'
          >
            <Avatar
              name={name}
              src={avatarUrl ?? undefined}
              className='w-[100px] **:data-[slot=name]:hidden **:data-[slot=role]:hidden'
              avatarClassName='!size-[100px]'
            />
            <span className='pointer-events-none absolute inset-0 overflow-hidden rounded-full'>
              <span className='absolute inset-x-0 bottom-0 flex h-1/3 items-center justify-center bg-black/20 text-white'>
                <Camera className='size-5' />
              </span>
            </span>
            <input
              id={inputId}
              type='file'
              accept='image/jpeg,image/png'
              className='sr-only'
              onChange={handleAvatarChange}
              disabled={isUploading}
            />
          </label>
          <div className='w-full space-y-3'>
            <div className='flex flex-wrap items-center justify-between'>
              <div className='flex flex-wrap items-center gap-3'>
                <h2 className='text-2xl font-bold text-[#232323]'>{name}</h2>
                <Chip label={role} variant='info' size='sm' />
              </div>
              <Button
                variant='ghost'
                size='sm'
                className='text-status-info hover:text-status-info w-fit gap-2 underline'
                onClick={onEditClick}
              >
                <SquarePen className='text-status-info size-4' />
                Edit
              </Button>
            </div>
            <div className='flex flex-wrap items-center justify-between gap-5 text-base text-[#4A5568]'>
              <span className='flex items-center gap-2'>
                <Mail className='text-status-info size-5' />
                {email ? email : 'N/A'}
              </span>
              <span className='flex items-center gap-2'>
                <Phone className='text-status-info size-5' />
                {phone ? phone : 'N/A'}
              </span>
              <span className='flex items-center gap-2'>
                <Building2 className='text-status-info size-5' />
                {organization ? organization : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Window>
  );
};
