import { LoaderCircle } from 'lucide-react';

import { Button, Modal, TitleAndDesc } from '@/shared/components';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onApprove: () => void;
  isApproving: boolean;
  requestLabel: string;
  patientName: string;
};

export const ApproveRequestModal = ({
  isOpen,
  onClose,
  onApprove,
  isApproving,
  requestLabel,
  patientName,
}: Props) => (
  <Modal
    isOpen={isOpen}
    onCloseAction={onClose}
    containerClassName='w-[90vw] max-w-2xl p-10'
  >
    <TitleAndDesc
      title='Approve Authorization Request'
      subtitle={`Are you sure you want to approve request ${requestLabel}? This will authorize the medical transport for ${patientName || 'this patient'}.`}
      titleClassName='text-lg md:text-xl lg:text-2xl'
      subtitleClassName='text-sm md:text-base text-gray-600'
    />
    <div className='mt-8 flex flex-wrap items-center justify-end gap-3'>
      <Button
        variant='default-outlined'
        className='w-max'
        onClick={onClose}
        disabled={isApproving}
      >
        Cancel
      </Button>
      <Button
        variant='success'
        onClick={onApprove}
        className='w-max'
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
