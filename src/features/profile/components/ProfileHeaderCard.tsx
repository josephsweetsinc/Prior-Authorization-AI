import { Building2, Mail, Phone, SquarePen } from 'lucide-react';

import { Avatar, Button, Chip, Window } from '@/shared/components';

type Props = {
  name: string;
  role: string;
  email: string;
  phone: string;
  organization: string;
  onEditClick?: () => void;
};

export const ProfileHeaderCard = ({
  name,
  role,
  email,
  phone,
  organization,
  onEditClick,
}: Props) => {
  return (
    <Window className='p-6'>
      <div className='flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between'>
        <div className='flex w-full flex-col gap-6 md:flex-row md:items-center'>
          <Avatar
            name={name}
            src='/images/mock_avatar.jpg'
            className='**:data-[slot=name]:hidden **:data-[slot=role]:hidden'
            avatarClassName='!size-[100px]'
          />
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
                {email}
              </span>
              <span className='flex items-center gap-2'>
                <Phone className='text-status-info size-5' />
                {phone}
              </span>
              <span className='flex items-center gap-2'>
                <Building2 className='text-status-info size-5' />
                {organization}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Window>
  );
};
