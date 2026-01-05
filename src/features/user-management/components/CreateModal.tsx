import { useRef } from 'react';

import { Button, Modal, TitleAndDesc } from '@/shared/components';
import { type ModalProps } from '@/shared/components/modal/Modal';

import { USER_FORM_DEFAULTS } from '../constants';

import { UserForm } from './UserForm';

export const CreateModal = (props: ModalProps) => {
  const formRef = useRef<HTMLFormElement | null>(null);

  const handleCreateUser = () => {};

  const triggerSubmit = () => formRef?.current?.requestSubmit();

  return (
    <Modal {...props}>
      <TitleAndDesc
        title='Add new user'
        subtitle='Create a new user account and assign appropriate permissions.'
        titleClassName='text-lg md:text-xl lg:text-2xl xl:text-3xl'
        subtitleClassName='text-sm md:text-base lg:text-lg'
      />
      <UserForm
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
        <Button variant='primary' onClick={triggerSubmit} className='w-max'>
          Create user
        </Button>
      </div>
    </Modal>
  );
};
