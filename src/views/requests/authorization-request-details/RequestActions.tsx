import { CircleCheck, CircleX } from 'lucide-react';

import { Button } from '@/shared/components';

type Props = {
  isVisible: boolean;
  onApprove: () => void;
};

export const RequestActions = ({ isVisible, onApprove }: Props) => {
  if (!isVisible) {
    return null;
  }

  return (
    <div className='space-y-3'>
      <Button
        variant={'success'}
        size={'default'}
        className='rounded-3xl'
        onClick={onApprove}
      >
        <CircleCheck size={20} className='text-white' strokeWidth={1.25} />{' '}
        Approve Request
      </Button>
      <Button
        variant={'destructive-outlined'}
        size={'default'}
        className='rounded-3xl'
      >
        <CircleX size={20} color='#FE5C73' strokeWidth={1.25} /> Deny Request
      </Button>
    </div>
  );
};
