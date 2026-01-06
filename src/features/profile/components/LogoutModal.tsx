import { Button, Modal } from '@/shared/components';
import { type ModalProps } from '@/shared/components/modal/Modal';

type Props = Omit<ModalProps, 'children'> & {
  onConfirm: () => void;
  isLoading?: boolean;
};

export const LogoutModal = ({
  onConfirm,
  isLoading = false,
  ...modalProps
}: Props) => {
  return (
    <Modal {...modalProps} containerClassName='max-w-[600px] w-screen'>
      <div className='space-y-4'>
        <h2 className='text-brand-dark text-[32px] font-bold'>Log out?</h2>
        <p className='text-gray-dark text-base'>
          Are you sure you want to log out?
        </p>
        <div className='flex flex-col gap-4 pt-2 sm:flex-row sm:justify-start'>
          <Button
            variant='primary'
            className='w-full rounded-full sm:w-50'
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Logging Out...' : 'Log Out'}
          </Button>
          <Button
            variant='gray'
            className='w-full rounded-full sm:w-32'
            onClick={modalProps.onCloseAction}
          >
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};
