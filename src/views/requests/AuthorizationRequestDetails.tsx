'use client';

import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { toast } from 'react-toastify';

import { parseApiError } from '@/services/api/types';
import {
  useApproveRequestMutation,
  useDenyRequestMutation,
  useGetRequestDetailsQuery,
  useUpdateRequestMutation,
} from '@/services/requests';
import { Chip, SensitiveMessage, TitleAndDesc } from '@/shared/components';
import { phonePattern } from '@/shared/lib/validations/schemas';

import { ApproveRequestModal } from './authorization-request-details/components/ApproveRequestModal';
import { AuthorizationRequestDetailsSkeleton } from './authorization-request-details/components/AuthorizationRequestDetailsSkeleton';
import { DenyRequestModal } from './authorization-request-details/components/DenyRequestModal';
import { RequestDetailsContent } from './authorization-request-details/components/RequestDetailsContent';
import { RequestDetailsSidebar } from './authorization-request-details/components/RequestDetailsSidebar';
import { type DenialReason } from './authorization-request-details/lib/denial-reasons';
import { type RequestDetailsFormState } from './authorization-request-details/lib/types';
import {
  buildRequestDetailsFormState,
  buildRequestDetailsUiState,
  buildRequestUpdatePayload,
} from './authorization-request-details/lib/utils/builders';

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
  const [isDenyModalOpen, setIsDenyModalOpen] = useState(false);
  const [approveRequest, { isLoading: isApproving }] =
    useApproveRequestMutation();
  const [denyRequest, { isLoading: isDenying }] = useDenyRequestMutation();
  const [updateRequest, { isLoading: isSaving }] = useUpdateRequestMutation();
  const [formState, setFormState] = useState<{
    requestId: number;
    state: RequestDetailsFormState;
  } | null>(null);
  const defaultFormState = useMemo(
    () => (data ? buildRequestDetailsFormState(data) : null),
    [data],
  );
  const resolvedDefaultFormState = data
    ? (defaultFormState ?? buildRequestDetailsFormState(data))
    : null;
  const effectiveFormState =
    formState && data && formState.requestId === data.id
      ? formState.state
      : resolvedDefaultFormState;
  const physicianPhoneError = useMemo(() => {
    const value = effectiveFormState?.physicianPhone?.trim() ?? '';
    if (!value) {
      return '';
    }

    return phonePattern.test(value)
      ? ''
      : 'Phone can contain only digits, spaces, and ()+-';
  }, [effectiveFormState?.physicianPhone]);

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

  const {
    statusConfig,
    shouldShowActions,
    patientName,
    requestLabel,
    timelineItems,
  } = buildRequestDetailsUiState(data);
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

  const handleDenyRequest = (payload: {
    reason: DenialReason;
    notes?: string;
  }) => {
    denyRequest({
      id: data.id,
      denial_reason: payload.reason,
      denial_notes: payload.notes,
    })
      .unwrap()
      .then(() => {
        toast.success('Request denied successfully.');
        setIsDenyModalOpen(false);
      })
      .catch((error) => {
        const parsedError = parseApiError(error);
        toast.error(parsedError.message ?? 'Failed to deny request.');
      });
  };

  const openApproveModal = () => setIsApproveModalOpen(true);
  const closeApproveModal = () => setIsApproveModalOpen(false);
  const openDenyModal = () => setIsDenyModalOpen(true);
  const closeDenyModal = () => setIsDenyModalOpen(false);

  const handleUpdateRequest = () => {
    if (physicianPhoneError) {
      toast.error('Please fix validation errors before saving.');
      return;
    }

    updateRequest({
      id: data.id,
      data: buildRequestUpdatePayload(effectiveFormState),
    })
      .unwrap()
      .then(() => {
        toast.success('Request updated successfully.');
      })
      .catch((error) => {
        const parsedError = parseApiError(error);
        toast.error(parsedError.message ?? 'Failed to update request.');
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
          form={effectiveFormState}
          onChange={(next) =>
            setFormState((prev) => {
              const baseState =
                prev?.requestId === data.id
                  ? prev.state
                  : resolvedDefaultFormState;
              return {
                requestId: data.id,
                state: {
                  ...baseState,
                  ...next,
                },
              };
            })
          }
          onSave={handleUpdateRequest}
          physicianPhoneError={physicianPhoneError}
          isSaving={isSaving}
        />

        <RequestDetailsSidebar
          shouldShowActions={shouldShowActions}
          onApprove={openApproveModal}
          onDeny={openDenyModal}
          timelineItems={timelineItems}
          documents={data.documents}
        />
      </section>
      <ApproveRequestModal
        isOpen={isApproveModalOpen}
        onCloseAction={closeApproveModal}
        onApprove={handleApproveRequest}
        isApproving={isApproving}
        requestLabel={requestLabel}
        patientName={patientName}
      />
      <DenyRequestModal
        key={isDenyModalOpen ? 'deny-open' : 'deny-closed'}
        isOpen={isDenyModalOpen}
        onCloseAction={closeDenyModal}
        onConfirm={handleDenyRequest}
        isSubmitting={isDenying}
        requestLabel={requestLabel}
      />
    </main>
  );
};

export default AuthorizationRequestDetails;
