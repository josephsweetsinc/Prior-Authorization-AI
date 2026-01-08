import { useMemo, useState } from 'react';

import {
  Button,
  Modal,
  type ModalProps,
  Select,
  TitleAndDesc,
} from '@/shared/components';

import { DENIAL_REASON_OPTIONS, DenialReason } from '../lib/denial-reasons';

type Props = {
  onConfirm: (_payload: { reason: DenialReason; notes?: string }) => void;
  isSubmitting: boolean;
  requestLabel: string;
} & ModalProps;

export const DenyRequestModal = ({
  isOpen,
  onCloseAction,
  containerClassName,
  onConfirm,
  isSubmitting,
  requestLabel,
  ...modalProps
}: Props) => {
  const [reason, setReason] = useState<DenialReason | ''>('');
  const [notes, setNotes] = useState('');

  const isOtherReason = reason === DenialReason.OtherReason;
  const isConfirmDisabled = useMemo(() => {
    if (!reason) {
      return true;
    }
    if (isOtherReason && !notes.trim()) {
      return true;
    }
    return false;
  }, [isOtherReason, notes, reason]);

  const handleConfirm = () => {
    if (!reason) {
      return;
    }
    onConfirm({
      reason,
      notes: isOtherReason ? notes.trim() : undefined,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onCloseAction={onCloseAction}
      containerClassName={containerClassName ?? 'w-[90vw] max-w-2xl p-10'}
      {...modalProps}
    >
      <TitleAndDesc
        title='Deny Authorization Request'
        subtitle={`Please provide a reason for denying request ${requestLabel}.`}
        titleClassName='text-lg md:text-xl lg:text-2xl'
        subtitleClassName='text-sm md:text-base text-gray-600'
      />

      <div className='mt-3 space-y-3'>
        <Select
          options={DENIAL_REASON_OPTIONS}
          value={reason}
          onChange={(value) => setReason(value as DenialReason)}
          placeholder='Select Reason'
        />

        {isOtherReason && (
          <textarea
            className='focus:border-accent-foreground min-h-[120px] w-full rounded-xl border border-[#E8E8E8] bg-white px-4 py-3 text-sm text-slate-700 shadow-sm transition outline-none focus:shadow-none'
            placeholder='Enter reason for denial...'
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
          />
        )}
      </div>

      <div className='mt-3 flex flex-wrap items-center justify-end gap-3'>
        <Button
          variant='gray'
          className='w-max rounded-3xl'
          onClick={onCloseAction}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          variant='destructive'
          onClick={handleConfirm}
          className='w-max rounded-3xl'
          disabled={isSubmitting || isConfirmDisabled}
        >
          Confirm Denial
        </Button>
      </div>
    </Modal>
  );
};
