import { LoaderCircle } from 'lucide-react';
import { toast } from 'react-toastify';

import { parseApiError } from '@/services/api/types';
import { useDeleteUserMutation } from '@/services/user-management';
import {
  Button,
  Modal,
  type ModalProps,
  TitleAndDesc,
} from '@/shared/components';

type Props = {
  userId?: number;
} & ModalProps;
export const DeleteModal = ({ userId, ...props }: Props) => {
  const [deleteUser, { isLoading }] = useDeleteUserMutation();

  if (!userId) {
    return;
  }

  const handleDeleteUser = () =>
    deleteUser(userId)
      .unwrap()
      .then(() => {
        toast.success('User was successfully deleted.');
        props.onCloseAction();
      })
      .catch((e) => {
        const parsedError = parseApiError(e);

        toast.error(parsedError.message);
      });

  return (
    <Modal {...props}>
      <TitleAndDesc
        title='Delete User'
        subtitle='Are you sure you want to delete this user?'
        titleClassName='text-lg md:text-xl lg:text-2xl xl:text-3xl'
        subtitleClassName='text-sm md:text-base lg:text-lg'
      />
      <p className='text-gray-dark my-6 text-sm md:text-base lg:text-lg'>
        All associated data, activity history, and permissions will be deleted
        and cannot be restored.
      </p>

      <div className='flex items-center justify-end gap-3'>
        <Button
          variant='default-outlined'
          className='w-max'
          onClick={props.onCloseAction}
        >
          Cancel
        </Button>
        <Button
          variant='destructive'
          onClick={handleDeleteUser}
          className='w-max'
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span>Deleting...</span>
              <LoaderCircle className='size-5 animate-spin' />
            </>
          ) : (
            'Delete user'
          )}
        </Button>
      </div>
    </Modal>
  );
};
