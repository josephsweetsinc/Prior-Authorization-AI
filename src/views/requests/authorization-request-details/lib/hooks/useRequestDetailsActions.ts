import { useState } from 'react';
import { toast } from 'react-toastify';

import { parseApiError } from '@/services/api/types';
import {
  useApproveRequestMutation,
  useDenyRequestMutation,
  useUpdateRequestMutation,
} from '@/services/requests';

import { type DenialReason } from '../denial-reasons';
import { type RequestDetailsFormState } from '../types';
import { buildRequestUpdatePayload } from '../utils/builders';

type Params = {
  requestId: number;
  resolvedFormState: RequestDetailsFormState;
  validateForm: () => boolean;
};

export const useRequestDetailsActions = ({
  requestId,
  resolvedFormState,
  validateForm,
}: Params) => {
  const [approveRequest, { isLoading: isApproving }] =
    useApproveRequestMutation();
  const [denyRequest, { isLoading: isDenying }] = useDenyRequestMutation();
  const [updateRequest, { isLoading: isSaving }] = useUpdateRequestMutation();

  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isDenyModalOpen, setIsDenyModalOpen] = useState(false);

  const handleApproveRequest = () => {
    approveRequest(requestId)
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
      id: requestId,
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

  const handleUpdateRequest = () => {
    if (!validateForm()) {
      toast.error('Please fix validation errors before saving.');
      return;
    }

    updateRequest({
      id: requestId,
      data: buildRequestUpdatePayload(resolvedFormState),
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

  return {
    isApproveModalOpen,
    isDenyModalOpen,
    isApproving,
    isDenying,
    isSaving,
    openApproveModal: () => setIsApproveModalOpen(true),
    closeApproveModal: () => setIsApproveModalOpen(false),
    openDenyModal: () => setIsDenyModalOpen(true),
    closeDenyModal: () => setIsDenyModalOpen(false),
    handleApproveRequest,
    handleDenyRequest,
    handleUpdateRequest,
  };
};
