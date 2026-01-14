import { LoaderCircle } from 'lucide-react';

import {
  Button,
  Modal,
  type ModalProps,
  TitleAndDesc,
} from '@/shared/components';

type Props = {
  onApprove: () => void;
  isApproving: boolean;
  requestLabel: string;
  patientName: string;
} & ModalProps;

export const ApproveRequestModal = ({
  onCloseAction,
  containerClassName,
  onApprove,
  isApproving,
  requestLabel,
  patientName,
  ...modalProps
}: Props) => (
  <Modal
    onCloseAction={onCloseAction}
    containerClassName={containerClassName ?? 'w-[90vw] max-w-2xl p-10'}
    {...modalProps}
  >
    <TitleAndDesc
      title='Approve Authorization Request'
      subtitle={`Are you sure you want to approve request ${requestLabel}? This will authorize the medical transport for ${patientName || 'this patient'}.`}
      titleClassName='text-lg md:text-xl lg:text-2xl'
      subtitleClassName='text-sm md:text-base text-gray-600'
    />
    <div className='mt-8 flex flex-wrap items-center justify-end gap-3'>
      <Button
        variant='gray'
        size='lg'
        className='h-10 w-max px-10 py-3 font-medium'
        onClick={onCloseAction}
        disabled={isApproving}
      >
        Cancel
      </Button>
      <Button
        variant='success'
        onClick={onApprove}
        className='h-10 w-50 p-2.5'
        disabled={isApproving}
      >
        {isApproving ? (
          <>
            <span>Approving...</span>
            <LoaderCircle className='size-5 animate-spin' />
          </>
        ) : (
          'Approve Request'
        )}
      </Button>
    </div>
  </Modal>
);
