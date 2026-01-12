import { Suspense } from 'react';

import { RequestsHistory } from '@/views/requests-history';

export default function RequestsHistoryPage() {
  return (
    <Suspense fallback={<div />}>
      <RequestsHistory />
    </Suspense>
  );
}
