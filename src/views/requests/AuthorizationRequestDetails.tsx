'use client';

import { useMemo, useState } from 'react';

import { useGetRequestDetailsQuery } from '@/services/requests';
import { Chip, SensitiveMessage } from '@/shared/components';
import {
  ApproveRequestModal,
  AuthorizationRequestDetailsSkeleton,
  DenyRequestModal,
  RequestDetailsContent,
  RequestDetailsHeader,
  RequestDetailsSidebar,
} from '@/views/requests/authorization-request-details/components';

import { EMPTY_FORM_STATE } from './authorization-request-details/lib/constants';
import { useRequestDetailsActions } from './authorization-request-details/lib/hooks/useRequestDetailsActions';
import { type RequestDetailsFormState } from './authorization-request-details/lib/types';
import {
  buildRequestDetailsFormState,
  buildRequestDetailsUiState,
} from './authorization-request-details/lib/utils/builders';
import { resolveFormState } from './authorization-request-details/lib/utils/form-state';
import {
  type RequestDetailsFormErrors,
  validateRequestDetailsForm,
} from './authorization-request-details/lib/validation';

type Props = {
  requestId: string;
};

const AuthorizationRequestDetails = ({ requestId }: Props) => {
  const numericRequestId = Number(requestId);
  const shouldSkip = Number.isNaN(numericRequestId);
  const { data, isLoading } = useGetRequestDetailsQuery(numericRequestId, {
    skip: shouldSkip,
  });
  const [formState, setFormState] = useState<{
    requestId: number;
    state: RequestDetailsFormState;
  } | null>(null);
  const [formErrors, setFormErrors] = useState<RequestDetailsFormErrors>({});
  const defaultFormState = useMemo(
    () => (data ? buildRequestDetailsFormState(data) : null),
    [data],
  );
  const resolvedFormState = data
    ? resolveFormState({
        data,
        formState,
        defaultFormState,
      })
    : EMPTY_FORM_STATE;
  const validateForm = () => {
    const result = validateRequestDetailsForm(resolvedFormState);
    setFormErrors(result.errors);
    return result.isValid;
  };
  const handleFormChange = (next: Partial<RequestDetailsFormState>) => {
    setFormErrors((prev) => {
      const keys = Object.keys(next) as Array<keyof RequestDetailsFormState>;
      if (keys.length === 0) {
        return prev;
      }
      const updated = { ...prev };
      keys.forEach((key) => {
        delete updated[key];
      });
      return updated;
    });
    setFormState((prev) => {
      const baseState =
        prev && prev.requestId === data?.id ? prev.state : resolvedFormState;
      return {
        requestId: data?.id ?? 0,
        state: {
          ...baseState,
          ...next,
        },
      };
    });
  };
  const {
    isApproveModalOpen,
    isDenyModalOpen,
    isApproving,
    isDenying,
    isSaving,
    openApproveModal,
    closeApproveModal,
    openDenyModal,
    closeDenyModal,
    handleApproveRequest,
    handleDenyRequest,
    handleUpdateRequest,
  } = useRequestDetailsActions({
    requestId: data?.id ?? 0,
    resolvedFormState,
    validateForm,
  });

  if (isLoading) {
    return <AuthorizationRequestDetailsSkeleton />;
  }

  if (!data) {
    return (
      <main className='space-y-6'>
        <RequestDetailsHeader
          title={`Request ${requestId}`}
          subtitle='CMS-10344 Medical Transportation Authorization Form'
        />
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

  return (
    <main className='space-y-6'>
      <RequestDetailsHeader
        title={`Request ${data.id}`}
        subtitle={`${data.form_number} Medical Transportation Authorization Form`}
        extra={
          <Chip
            variant={statusConfig?.variant ?? 'warning'}
            label={statusConfig?.label ?? 'Unknown'}
            className='self-end px-4 py-2.5 text-[16px]'
          />
        }
      />

      <section className='grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]'>
        <RequestDetailsContent
          data={data}
          form={resolvedFormState}
          errors={formErrors}
          onChange={handleFormChange}
          onSave={handleUpdateRequest}
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
