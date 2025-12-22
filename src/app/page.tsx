'use client';

import { type ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';
import { useState } from 'react';

import {
  ArrowTopRightIcon,
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
  DataTable,
  DateInput,
  Input,
  InputOTPControlled,
  SensitiveMessage,
  BarChart,
  StatusTimeline,
  Tabs,
  TabsList,
  TabsTrigger,
  DonutChart,
} from '@/shared/components';
import { Checkbox } from '@/shared/components/checkbox/checkbox';
import { Select } from '@/shared/components/select';

export type Payment = {
  id: string;
  patient: string;
  transportType: 'Ambulance' | 'Wheelchair' | 'Air Ambulance' | 'Stretcher';
  status: 'Approved' | 'Pending' | 'Denied';
  email: string;
};

function getData(): Payment[] {
  return [
    {
      id: 'REQ-12850',
      patient: 'John Anderson',
      transportType: 'Ambulance',
      status: 'Approved',
      email: 'm@example.com',
    },
    {
      id: 'REQ-12851',
      patient: 'Mary Thompson',
      transportType: 'Wheelchair',
      status: 'Pending',
      email: 'm@example.com',
    },
    {
      id: 'REQ-12852',
      patient: 'Robert Martinez',
      transportType: 'Air Ambulance',
      status: 'Denied',
      email: 'm@example.com',
    },
    {
      id: 'REQ-12853',
      patient: 'Patricia Davis',
      transportType: 'Stretcher',
      status: 'Denied',
      email: 'm@example.com',
    },
  ];
}

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: 'id',
    header: 'REQUEST ID',
  },
  {
    accessorKey: 'patient',
    header: 'PATIENT',
  },
  {
    accessorKey: 'transportType',
    header: 'TRANSPORT TYPE',
  },
  {
    accessorKey: 'status',
    header: 'STATUS',
    cell: () => <Chip variant='success' size='sm' label='Approved' />,
  },
  {
    id: 'actions',
    header: 'ACTIONS',
    cell: () => (
      <div className='flex items-center gap-2'>
        <Link className='text-accent-foreground' href='/'>
          More Details
        </Link>
        <ArrowTopRightIcon />
      </div>
    ),
  },
];

export default function Home() {
  const [period, setPeriod] = useState('');
  const data = getData();

  const testChartData = [
    { date: '02', uv: 15 },
    { date: '03', uv: 22 },
    { date: '04', uv: 10 },
    { date: '05', uv: 18 },
    { date: '06', uv: 15 },
    { date: '07', uv: 22 },
    { date: '08', uv: 10 },
    { date: '09', uv: 18 },
    { date: '10', uv: 18 },
    { date: '11', uv: 15 },
    { date: '12', uv: 22 },
    { date: '13', uv: 10 },
    { date: '14', uv: 18 },
  ];

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
        <DataTable columns={columns} data={data} />

        <Checkbox label='text' />

        <StatusTimeline
          items={[
            {
              title: 'Request Submitted',
              date: 'Jan 15, 2025 at 10:30 AM',
              status: 'success',
            },
            {
              title: 'Under Review',
              date: 'Jan 16, 2025 at 10:30 AM',
              status: 'pending',
            },
            {
              title: 'Insurance Reviewer',
              description:
                'Additional documentation may be required for medical necessity.',
              status: 'error',
            },
          ]}
        />

        <Tabs defaultValue='all'>
          <TabsList>
            <TabsTrigger value='all'>All</TabsTrigger>
            <TabsTrigger value='unread'>Unread (2)</TabsTrigger>
            <TabsTrigger value='statusUpdate'>Status Update (1)</TabsTrigger>
            <TabsTrigger value='documents'>Documents (4)</TabsTrigger>
            <TabsTrigger value='requirements'>Requirements (2)</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className='my-2 flex w-full flex-col gap-2'>
          <p className='text-2xl font-bold text-[#193782]'>
            Processing Time Distribution
          </p>
          <BarChart
            data={testChartData}
            xKey='date'
            valueKey='uv'
            tooltipLabel='Requests'
            height={250}
            barSize={12}
          />
        </div>

        <DonutChart
          data={[
            { label: 'Approved', value: 68, color: '#2FB400' },
            { label: 'Pending', value: 22, color: '#FFA800' },
            { label: 'Denied', value: 12, color: '#FF5C70' },
          ]}
        />
      </main>
    </div>
  );
}
