import { Suspense } from 'react';

import { NewRequestFlow } from '@/features/new-request';

export default function NewRequest() {
  return (
    <Suspense>
      <NewRequestFlow />
    </Suspense>
  );
}
