import { LoaderCircle } from 'lucide-react';
import { useRef } from 'react';
import { toast } from 'react-toastify';

import { useCreateUserMutation } from '@/services/user-management';
import { Button, Modal, TitleAndDesc } from '@/shared/components';
import { type ModalProps } from '@/shared/components/modal/Modal';

import { USER_FORM_DEFAULTS } from '../constants';
import { type ICreateFormData } from '../types';

import { CreateUserForm } from './CreateUserForm';

export const CreateModal = (props: ModalProps) => {
  const formRef = useRef<HTMLFormElement | null>(null);

  const [createUser, { isLoading }] = useCreateUserMutation();

  const handleCreateUser = (data: ICreateFormData) => {
    const { fullName, ...newUserData } = data;
    const [name, surname] = fullName.split(' ');

    createUser({ name, surname, ...newUserData })
      .unwrap()
      .then(() => toast.success(`User "${name}" was added successfully.`))
      .catch((e) => {
        console.error(e.message);
        toast.error('Failed to create a new user.');
      });
  };

  const triggerSubmit = () => formRef?.current?.requestSubmit();

  return (
    <Modal {...props}>
      <TitleAndDesc
        title='Add new user'
        subtitle='Create a new user account and assign appropriate permissions.'
        titleClassName='text-lg md:text-xl lg:text-2xl xl:text-3xl'
        subtitleClassName='text-sm md:text-base lg:text-lg'
      />
      <CreateUserForm
        onSubmit={handleCreateUser}
        onCancel={props.onCloseAction}
        defaults={USER_FORM_DEFAULTS}
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
              <span>Creating...</span>
              <LoaderCircle className='size-5 animate-spin' />
            </>
          ) : (
            'Create user'
          )}
        </Button>
      </div>
    </Modal>
  );
};
