'use client';

import { useState } from 'react';

import {
  BellIcon,
  DenyIcon,
  GearIcon,
  GoogleIcon,
  SuccessIcon,
} from '@/shared/assets/icons';
import {
  Avatar,
  Button,
  Chip,
  DateInput,
  Input,
  InputOTPControlled,
  SensitiveMessage,
} from '@/shared/components';
import { Select } from '@/shared/components/select';

export default function Home() {
  const [period, setPeriod] = useState('');

  const periodOptions = [
    { label: 'All Time', value: 'all' },
    { label: 'Today', value: 'today' },
    { label: 'Last 7 Days', value: '7d' },
    { label: 'This Year', value: 'year' },
  ];
  return (
    <div className='flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black'>
      <main className='flex min-h-screen w-full max-w-3xl flex-col items-center justify-center gap-4 bg-white px-16 py-32 sm:items-start dark:bg-black'>
        <div className='flex gap-2'>
          <Button variant={'ghost'} size={'icon'}>
            <BellIcon />
          </Button>
          <Button variant={'ghost'} size={'icon'}>
            <GearIcon />
          </Button>
        </div>
        <Button variant={'default'} size={'default'}>
          Sign in with Google <GoogleIcon />
        </Button>
        <Button variant={'primary'} size={'default'}>
          Sign In
        </Button>
        <Button variant={'destructive'} size={'default'}>
          Delete User
        </Button>
        <Button variant={'destructive-outlined'} size={'default'}>
          <DenyIcon /> Deny Request
        </Button>
        <Button variant={'success'} size={'default'}>
          <SuccessIcon /> Approve Request
        </Button>
        <Button variant={'default-outlined'} size={'default'}>
          Cancel
        </Button>
        <Button variant={'ghost'} size={'default'}>
          Back
        </Button>

        <Input label='Email' type='email' />
        <Input label='Password' type='password' />
        <Input label='Search patients or requests' type='search' />
        <InputOTPControlled />
        <div className='w-full pt-6'>
          <DateInput label='Date of Birth' />
        </div>

        <Select options={periodOptions} value={period} onChange={setPeriod} />
        <Avatar name='Joe Dohn' role='Admin' />

        <div className='max-w-2xl space-y-6 bg-white p-10'>
          <SensitiveMessage
            variant='ai'
            title='AI Confidence Score: 98%'
            description='This form was automatically populated by our AI engine. All fields have been verified against patient records and physician notes'
          />

          <SensitiveMessage
            variant='info'
            title='Report Info'
            description='Reports are generated in real-time based on current system data. Large date ranges may take longer to process.'
          />

          <SensitiveMessage
            variant='success'
            title='All Required Fields Validated'
            description='The AI has successfully extracted and validated all required information from your documents.'
          />
        </div>

        <div className='flex flex-col items-start gap-8 bg-white p-10'>
          <div className='space-y-4'>
            <h3 className='text-sm font-bold text-gray-500'>Design Match:</h3>
            <Chip variant='success' label='Approved' />

            <Chip variant='info' label='Processing' />

            <Chip variant='destructive' label='Denied' />

            <Chip variant='warning' label='Pending' />
          </div>

          <div className='space-y-4'>
            <h3 className='text-sm font-bold text-gray-500'>
              Interface Control:
            </h3>

            <div className='flex items-center gap-2'>
              <Chip variant='success' label='Approved' withIcon />
              <Chip variant='destructive' label='Denied' withIcon />
              <Chip variant='info' label='Processing' withIcon />
              <Chip variant='warning' label='Pending' withIcon />
            </div>

            <div className='flex items-center gap-2'>
              <Chip variant='default' size='sm' label='Small' />
              <Chip variant='default' size='default' label='Default' />
              <Chip variant='default' size='lg' label='Large' />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
