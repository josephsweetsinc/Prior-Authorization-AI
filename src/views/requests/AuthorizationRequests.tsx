'use client';

import { type ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';
import { useMemo, useState } from 'react';

import {
  DATE_OPTIONS,
  DAY_MS,
  STATUS_OPTIONS,
} from '@/features/requests-history/constants';
import { type RequestStatus } from '@/services/dashboard';
import {
  DataTable,
  Input,
  StatusChip,
  Select,
  TitleAndDesc,
  TableHeadCell,
} from '@/shared/components';

type RequestRow = {
  id: string;
  patient: string;
  transportType: string;
  status: RequestStatus;
  createdAt: Date;
};

const buildMockRequests = (): RequestRow[] => {
  const now = new Date();
  return [
    {
      id: 'REQ-12850',
      patient: 'John Anderson',
      transportType: 'Ambulance',
      status: 'approved',
      createdAt: new Date(now.getTime() - 1 * DAY_MS),
    },
    {
      id: 'REQ-12851',
      patient: 'Mary Thompson',
      transportType: 'Wheelchair Van',
      status: 'pending',
      createdAt: new Date(now.getTime() - 2 * DAY_MS),
    },
    {
      id: 'REQ-12852',
      patient: 'Robert Martinez',
      transportType: 'Air Ambulance',
      status: 'denied',
      createdAt: new Date(now.getTime() - 4 * DAY_MS),
    },
    {
      id: 'REQ-12853',
      patient: 'Patricia Davis',
      transportType: 'Ambulance',
      status: 'approved',
      createdAt: new Date(now.getTime() - 7 * DAY_MS),
    },
    {
      id: 'REQ-12854',
      patient: 'James Wilson',
      transportType: 'Stretcher',
      status: 'pending',
      createdAt: new Date(now.getTime() - 12 * DAY_MS),
    },
    {
      id: 'REQ-12855',
      patient: 'John Anderson',
      transportType: 'Wheelchair Van',
      status: 'approved',
      createdAt: new Date(now.getTime() - 15 * DAY_MS),
    },
    {
      id: 'REQ-12856',
      patient: 'Mary Thompson',
      transportType: 'Ambulance',
      status: 'denied',
      createdAt: new Date(now.getTime() - 18 * DAY_MS),
    },
    {
      id: 'REQ-12857',
      patient: 'Robert Martinez',
      transportType: 'Air Ambulance',
      status: 'denied',
      createdAt: new Date(now.getTime() - 21 * DAY_MS),
    },
  ];
};

const AuthorizationRequests = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const data = useMemo(() => buildMockRequests(), []);

  const filteredData = useMemo(() => {
    let next = [...data];

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      next = next.filter(
        (item) =>
          item.patient.toLowerCase().includes(q) ||
          item.id.toLowerCase().includes(q),
      );
    }

    if (statusFilter !== 'all') {
      next = next.filter((item) => item.status === statusFilter);
    }

    if (dateRange !== 'all') {
      const now = new Date();
      next = next.filter((item) => {
        const created = item.createdAt;
        switch (dateRange) {
          case 'today':
            return created.toDateString() === now.toDateString();
          case '7-days':
            return created >= new Date(now.getTime() - 7 * DAY_MS);
          case '30-days':
            return created >= new Date(now.getTime() - 30 * DAY_MS);
          case '90-days':
            return created >= new Date(now.getTime() - 90 * DAY_MS);
          case 'year':
            return created.getFullYear() === now.getFullYear();
          default:
            return true;
        }
      });
    }

    return next;
  }, [data, dateRange, searchQuery, statusFilter]);

  const columns = useMemo<ColumnDef<RequestRow>[]>(
    () => [
      {
        accessorKey: 'id',
        header: () => <TableHeadCell>Request ID</TableHeadCell>,
        cell: ({ getValue }) => (
          <span className='text-foreground font-bold'>
            {getValue<string>()}
          </span>
        ),
      },
      {
        accessorKey: 'patient',
        header: () => <TableHeadCell>Patient</TableHeadCell>,
      },
      {
        accessorKey: 'transportType',
        header: () => <TableHeadCell>Transport Type</TableHeadCell>,
      },
      {
        accessorKey: 'status',
        header: () => <TableHeadCell>Status</TableHeadCell>,
        cell: ({ getValue }) => (
          <StatusChip status={getValue<RequestStatus>()} />
        ),
      },
      {
        accessorKey: 'createdAt',
        header: () => <TableHeadCell>Date</TableHeadCell>,
        cell: ({ getValue }) => {
          const date = getValue<Date>();
          const formatted = date.toLocaleDateString('en-US');
          return <time dateTime={date.toISOString()}>{formatted}</time>;
        },
      },
      {
        id: 'actions',
        header: () => <TableHeadCell>Action</TableHeadCell>,
        cell: ({ row }) => (
          <Link
            href={`/requests/${row.original.id}`}
            className='text-status-info flex items-center gap-2 font-medium'
          >
            <span>More Details</span>
            <svg
              width='18'
              height='18'
              viewBox='0 0 24 24'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M7 17L17 7'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
              />
              <path
                d='M9 7H17V15'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
              />
            </svg>
          </Link>
        ),
      },
    ],
    [],
  );

  return (
    <main className='space-y-6'>
      <TitleAndDesc
        title='Authorization Requests'
        subtitle='Review and manage all medical transport authorization requests'
      />

      <section className='space-y-5'>
        <div className='flex flex-col gap-3 lg:flex-row lg:items-center'>
          <Input
            type='search'
            placeholder='Search by Patient, ID or request...'
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className='lg:flex-1'
          />
          <Select
            options={DATE_OPTIONS}
            value={dateRange}
            onChange={setDateRange}
            className='lg:w-44'
          />
          <Select
            options={STATUS_OPTIONS}
            value={statusFilter}
            onChange={setStatusFilter}
            className='lg:w-44'
          />
        </div>

        <DataTable columns={columns} data={filteredData} pagination />
      </section>
    </main>
  );
};

export default AuthorizationRequests;
