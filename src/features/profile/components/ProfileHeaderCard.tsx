'use client';

import { Building2, Camera, Mail, Phone, SquarePen } from 'lucide-react';
import { type ChangeEvent, useId } from 'react';
import { toast } from 'react-toastify';

import { useUploadAvatarMutation } from '@/services/auth/api/auth-api-service';
import { Avatar, Button, Chip, Window } from '@/shared/components';

import { ALLOWED_AVATAR_TYPES, MAX_AVATAR_SIZE_BYTES } from '../constants';

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
  const isAdmin = role.toLowerCase() === 'admin';

  const handleAvatarChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) {
      return;
    }

    if (
      !ALLOWED_AVATAR_TYPES.includes(
        file.type as (typeof ALLOWED_AVATAR_TYPES)[number],
      )
    ) {
      toast.error('Only JPG or PNG files are allowed.');
      return;
    }

    if (file.size > MAX_AVATAR_SIZE_BYTES) {
      toast.error('Avatar must be 5MB or less.');
      return;
    }

    try {
      await uploadAvatar(file).unwrap();
    } catch {
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
              className='w-25 **:data-[slot=name]:hidden **:data-[slot=role]:hidden'
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
                <h2 className='text-2xl font-bold text-black'>{name}</h2>
                {!isAdmin && <Chip label={role} variant='info' size='sm' />}
              </div>
              {!isAdmin && (
                <Button
                  variant='ghost'
                  size='sm'
                  className='text-status-info hover:text-status-info w-fit gap-2 underline'
                  onClick={onEditClick}
                >
                  <SquarePen className='text-status-info size-4' />
                  Edit
                </Button>
              )}
            </div>
            <div className='text-gray-dark flex flex-wrap items-center justify-between gap-5 text-base'>
              <span className='flex items-center gap-2'>
                <Mail className='text-status-info size-5' />
                {email ? email : 'N/A'}
              </span>
              <span className='flex items-center gap-2'>
                <Phone className='text-status-info size-5' />
                {phone ? phone : 'N/A'}
              </span>
              {!isAdmin ? (
                <span className='flex items-center gap-2'>
                  <Building2 className='text-status-info size-5' />
                  {organization ? organization : 'N/A'}
                </span>
              ) : (
                <span />
              )}
            </div>
          </div>
        </div>
      </div>
    </Window>
  );
};
