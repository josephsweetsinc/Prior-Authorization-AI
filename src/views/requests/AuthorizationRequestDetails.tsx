'use client';

import { format } from 'date-fns';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'react-toastify';

import { parseApiError } from '@/services/api/types';
import {
  useApproveRequestMutation,
  useGetRequestDetailsQuery,
} from '@/services/requests-history';
import { Chip, SensitiveMessage, TitleAndDesc } from '@/shared/components';
import { STATUS_CONFIG } from '@/shared/components/status-chip';

import { ApproveRequestModal } from './authorization-request-details/ApproveRequestModal';
import { AuthorizationRequestDetailsSkeleton } from './authorization-request-details/AuthorizationRequestDetailsSkeleton';
import { RequestDetailsContent } from './authorization-request-details/RequestDetailsContent';
import { RequestDetailsSidebar } from './authorization-request-details/RequestDetailsSidebar';
import {
  formatDate,
  formatTime,
  STATUS_LABELS,
  TIMELINE_STATUS_MAP,
} from './authorization-request-details/utils';

type Props = {
  requestId: string;
};

const AuthorizationRequestDetails = ({ requestId }: Props) => {
  const numericRequestId = Number(requestId);
  const shouldSkip = Number.isNaN(numericRequestId);
  const { data, isLoading } = useGetRequestDetailsQuery(numericRequestId, {
    skip: shouldSkip,
  });
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [approveRequest, { isLoading: isApproving }] =
    useApproveRequestMutation();

  if (isLoading) {
    return <AuthorizationRequestDetailsSkeleton />;
  }

  if (!data) {
    return (
      <main className='space-y-6'>
        <section className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
          <div className='space-y-4'>
            <Link
              href='/requests'
              className='flex items-center text-sm text-[#4A5568]'
            >
              <ChevronLeft
                color='#4A5568'
                strokeWidth={1.25}
                width={16}
                height={16}
              />{' '}
              Back to Request
            </Link>
            <TitleAndDesc
              title={`Request ${requestId}`}
              subtitle='CMS-10344 Medical Transportation Authorization Form'
              titleClassName='text-2xl md:text-3xl'
              subtitleClassName='text-base'
            />
          </div>
        </section>
        <SensitiveMessage
          variant='destructive'
          title='Request details unavailable'
          description='We could not load this request. Please try again.'
        />
      </main>
    );
  }

  const statusConfig = STATUS_CONFIG[data.status];
  const patientDob = formatDate(data.patient_date_of_birth);
  const appointmentDate = formatDate(data.date_of_transport);
  const appointmentTime = formatTime(data.time_of_transport);
  const shouldShowActions =
    data.status !== 'approved' && data.status !== 'denied';
  const patientName =
    `${data.patient_first_name} ${data.patient_last_name}`.trim();
  const requestLabel = data.form_number || String(data.id);

  const timelineItems = data.status_history.map((item) => ({
    title: STATUS_LABELS[item.status] ?? 'Status Update',
    date: item.created_at
      ? format(new Date(item.created_at), 'MMM dd, yyyy p')
      : undefined,
    description: item.notes ?? undefined,
    status: TIMELINE_STATUS_MAP[item.status] ?? 'pending',
  }));

  const handleApproveRequest = () => {
    approveRequest(data.id)
      .unwrap()
      .then(() => {
        toast.success('Request approved successfully.');
        setIsApproveModalOpen(false);
      })
      .catch((error) => {
        const parsedError = parseApiError(error);
        toast.error(parsedError.message ?? 'Failed to approve request.');
      });
  };

  return (
    <main className='space-y-6'>
      <section className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
        <div className='space-y-4'>
          <Link
            href='/requests'
            className='flex items-center text-sm text-[#4A5568]'
          >
            <ChevronLeft
              color='#4A5568'
              strokeWidth={1.25}
              width={16}
              height={16}
            />{' '}
            Back to Request
          </Link>
          <TitleAndDesc
            title={`Request ${data.id}`}
            subtitle={`${data.form_number} Medical Transportation Authorization Form`}
            titleClassName='text-2xl md:text-3xl'
            subtitleClassName='text-base'
          />
        </div>
        <Chip
          variant={statusConfig?.variant ?? 'warning'}
          label={statusConfig?.label ?? 'Unknown'}
          className='self-end px-4 py-2.5 text-[16px]'
        />
      </section>

      <section className='grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]'>
        <RequestDetailsContent
          data={data}
          patientDob={patientDob}
          appointmentDate={appointmentDate}
          appointmentTime={appointmentTime}
        />

        <RequestDetailsSidebar
          shouldShowActions={shouldShowActions}
          onApprove={() => setIsApproveModalOpen(true)}
          timelineItems={timelineItems}
          documents={data.documents}
        />
      </section>
      <ApproveRequestModal
        isOpen={isApproveModalOpen}
        onClose={() => setIsApproveModalOpen(false)}
        onApprove={handleApproveRequest}
        isApproving={isApproving}
        requestLabel={requestLabel}
        patientName={patientName}
      />
    </main>
  );
};

export default AuthorizationRequestDetails;
