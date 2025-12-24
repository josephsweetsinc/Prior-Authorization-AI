import { ChevronLeft, ChevronRight } from 'lucide-react';

import { DateInput, Input, Select } from '@/shared/components';
import { Button } from '@/shared/components/button';

interface InfoStepProps {
  onBack: () => void;
  onNext: () => void;
}

export const InfoStep = ({ onBack, onNext }: InfoStepProps) => {
  return (
    <div className='space-y-8'>
      <div>
        <h2 className='text-[22px] font-bold text-[#232323]'>
          Transportation Information
        </h2>
        <p className='mt-2 text-lg font-medium text-[#232323]'>
          Specify the transportation type, schedule and locations
        </p>
      </div>

      <div className='space-y-5'>
        <Select
          options={[{ label: 'test', value: 'test' }]}
          label='Transportation Type'
        />
        <div className='flex w-full justify-between gap-5'>
          <Input label='Patient First Name' labelVariant='static' />
          <Input label='Patient Last Name' labelVariant='static' />
        </div>
        <div className='flex w-full justify-between gap-5'>
          <DateInput label='Date of Birth' />
          <Input label='Patient ID' labelVariant='static' />
        </div>
        <div className='flex w-full justify-between gap-5'>
          <DateInput label='Patient First Name' />
          <Input label='Time of Transport' labelVariant='static' />
        </div>
        <Select
          options={[{ label: 'test', value: 'test' }]}
          label='Pickup Address'
        />
        <Select
          options={[{ label: 'test', value: 'test' }]}
          label='Destination Address'
        />
      </div>

      <div className='flex justify-between pt-4'>
        <Button
          variant='gray'
          size='lg'
          onClick={onBack}
          className='w-fit !px-10 !py-3 font-medium'
        >
          <ChevronLeft color='#232323' strokeWidth={1.5} />
          Back
        </Button>
        <Button
          variant='primary'
          size='lg'
          onClick={onNext}
          className='w-fit !px-10 !py-3 font-medium'
        >
          Next
          <ChevronRight color='#FFFFFF' strokeWidth={1.5} />
        </Button>
      </div>
    </div>
  );
};
