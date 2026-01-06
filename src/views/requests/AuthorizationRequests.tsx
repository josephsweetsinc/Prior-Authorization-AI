import { AuthorizationRequestsContainer } from '@/features/authorization-requests';
import { TitleAndDesc } from '@/shared/components';

const AuthorizationRequests = () => {
  return (
    <main className='space-y-6'>
      <TitleAndDesc
        title='Authorization Requests'
        subtitle='Review and manage all medical transport authorization requests'
      />

      <AuthorizationRequestsContainer />
    </main>
  );
};

export default AuthorizationRequests;
