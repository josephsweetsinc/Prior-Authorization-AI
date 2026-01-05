import { LoaderCircle } from 'lucide-react';
import { useMemo, useRef } from 'react';
import { toast } from 'react-toastify';

import { parseApiError } from '@/services/api/types';
import {
  type IUserEntry,
  useUpdateUserMutation,
} from '@/services/user-management';
import { Button, Modal, TitleAndDesc } from '@/shared/components';
import { type ModalProps } from '@/shared/components/modal/Modal';

import { type IFormData } from '../types';

import { UpdateUserForm } from './UpdateUserForm';

type Props = {
  user: IUserEntry | null;
} & ModalProps;
export const UpdateModal = ({ user, ...props }: Props) => {
  const formRef = useRef<HTMLFormElement | null>(null);

  const [updateUser, { isLoading }] = useUpdateUserMutation();

  const handleUpdateUser = (data: IFormData) => {
    const { fullName, ...newUserData } = data;
    const [name, surname] = fullName.split(' ');

    updateUser({ id: user!.id, data: { name, surname, ...newUserData } })
      .unwrap()
      .then(() => toast.success(`User "${name}" was updated successfully.`))
      .catch((e) => {
        const parsedError = parseApiError(e);

        toast.error(parsedError.message);
      });
  };

  const formDefaults = useMemo(
    () => ({
      fullName: user ? user.full_name : '',
      role: user ? user.role : 'provider',
      email: user ? user.email : '',
    }),
    [user],
  );

  const triggerSubmit = () => formRef?.current?.requestSubmit();

  if (!user) {
    return;
  }

  return (
    <Modal {...props}>
      <TitleAndDesc
        title='Edit User'
        subtitle='Update user information and permissions.'
        titleClassName='text-lg md:text-xl lg:text-2xl xl:text-3xl'
        subtitleClassName='text-sm md:text-base lg:text-lg'
      />
      <UpdateUserForm
        onSubmit={handleUpdateUser}
        onCancel={props.onCloseAction}
        defaults={formDefaults}
        className='my-6'
        ref={formRef}
      />
      <div className='flex items-center justify-end gap-3'>
        <Button
          variant='default-outlined'
          className='w-max'
          onClick={props.onCloseAction}
        >
          Cancel
        </Button>
        <Button
          variant='primary'
          onClick={triggerSubmit}
          disabled={isLoading}
          className='w-max'
        >
          {isLoading ? (
            <>
              <span>Updating...</span>
              <LoaderCircle className='size-5 animate-spin' />
            </>
          ) : (
            'Update user'
          )}
        </Button>
      </div>
    </Modal>
  );
};
