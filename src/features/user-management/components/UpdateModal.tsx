import { LoaderCircle } from 'lucide-react';
import { useMemo, useRef } from 'react';
import { toast } from 'react-toastify';

import { parseApiError } from '@/services/api/types';
import {
  type IUserEntry,
  useUpdateUserMutation,
} from '@/services/user-management';
import {
  Button,
  Modal,
  TitleAndDesc,
  type ModalProps,
} from '@/shared/components';

import { type IUpdateFormData } from '../types';
import { splitFullName } from '../utils';

import { UpdateUserForm } from './UpdateUserForm';

type Props = {
  user: IUserEntry | null;
} & ModalProps;
export const UpdateModal = ({ user, ...props }: Props) => {
  const formRef = useRef<HTMLFormElement | null>(null);

  const [updateUser, { isLoading }] = useUpdateUserMutation();

  const handleUpdateUser = (data: IUpdateFormData) => {
    updateUser({
      id: user!.id,
      data,
    })
      .unwrap()
      .then((payload) => {
        toast.success(`User "${payload.name}" was updated successfully.`);
        props.onCloseAction();
      })
      .catch((e) => {
        const parsedError = parseApiError(e);

        toast.error(parsedError.message);
      });
  };

  const [name, surname] = splitFullName(user?.full_name);

  const formDefaults = useMemo(
    () => ({
      name: name ?? '',
      surname: surname ?? '',
      role: user ? user.role : 'provider',
      email: user ? user.email : '',
    }),
    [user, name, surname],
  );

  const triggerSubmit = () => formRef?.current?.requestSubmit();

  if (!user) {
    return null;
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
