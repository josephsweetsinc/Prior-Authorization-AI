import { NewRequestFlow } from '@/features/new-request';

interface PageProps {
  params: {
    draftId: number;
  };
}

export default async function NewRequest(props: PageProps) {
  const searchParams = await props.params;

  return <NewRequestFlow draftId={searchParams.draftId} />;
}
