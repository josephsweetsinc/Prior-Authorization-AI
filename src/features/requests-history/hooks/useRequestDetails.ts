'use client';

import { useState } from 'react';

interface IDetailsState {
  requestId: number | null;
  open: boolean;
}

export const useRequestDetails = () => {
  const [details, setDetails] = useState<IDetailsState>({
    requestId: null,
    open: false,
  });

  const handleDetailsClick = (requestId: number) => {
    setDetails({ requestId: requestId, open: true });
  };

  const handleDetailsClose = () => {
    setDetails({ requestId: null, open: false });
  };

  return {
    details,
    handleDetailsClick,
    handleDetailsClose,
  };
};
