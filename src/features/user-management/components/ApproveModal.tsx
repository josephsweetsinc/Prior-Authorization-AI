import { LoaderCircle } from 'lucide-react';
import { toast } from 'react-toastify';

import { parseApiError } from '@/services/api/types';
import { useApproveUserMutation } from '@/services/user-management';
import {
  Button,
  Modal,
  type ModalProps,
  TitleAndDesc,
} from '@/shared/components';

type Props = {
  userId?: number;
} & ModalProps;

export const ApproveModal = ({ userId, ...props }: Props) => {
  const [approveUser, { isLoading }] = useApproveUserMutation();

  if (!userId) {
    return;
  }

  const handleApproveUser = () =>
    approveUser(userId)
      .unwrap()
      .then(() => {
        toast.success('User was successfully approved.');
        props.onCloseAction();
      })
      .catch((e) => {
        const parsedError = parseApiError(e);
        toast.error(parsedError.message);
      });

  return (
    <Modal {...props}>
      <TitleAndDesc
        title='Approve User'
        titleClassName='text-lg md:text-xl lg:text-2xl xl:text-3xl'
        subtitleClassName='text-sm md:text-base lg:text-lg'
      />
      <p className='text-gray-dark my-6 text-sm md:text-base lg:text-lg'>
        Are you sure you want to approve this provider? <br /> Once approved,
        this provider will have access to the full account history and all
        associated documents for 30 days.
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
          variant='primary'
          onClick={handleApproveUser}
          className='w-max'
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span>Approving...</span>
              <LoaderCircle className='size-5 animate-spin' />
            </>
          ) : (
            'Approve User'
          )}
        </Button>
      </div>
    </Modal>
  );
};
