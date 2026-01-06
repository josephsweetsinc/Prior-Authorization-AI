import { AuthorizationRequestDetails } from '@/views/requests';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function RequestDetailsPage({ params }: Props) {
  const { id } = await params;
  return <AuthorizationRequestDetails requestId={id} />;
}
