import { RequestsHistoryContainer } from '@/features/requests-history';
import { TitleAndDesc } from '@/shared/components';

const RequestsHistory = () => {
  return (
    <main className='space-y-6'>
      <TitleAndDesc
        title='Request Status Tracking'
        subtitle='Monitor the progress of your submitted authorization requests'
      />

      <RequestsHistoryContainer />
    </main>
  );
};
export default RequestsHistory;
