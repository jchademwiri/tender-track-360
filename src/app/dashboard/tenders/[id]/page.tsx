import { getCurrentUser } from '@/server';
import { getTenderById } from '@/server/tenders';
import { TenderDetails } from '@/components/tenders/tender-details';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface TenderDetailPageProps {
  params: {
    id: string;
  };
}

export default async function TenderDetailPage({
  params,
}: TenderDetailPageProps) {
  const { session } = await getCurrentUser();
  const { id } = await params;

  if (!session.activeOrganizationId) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">
            No Organization Selected
          </h2>
          <p className="text-gray-600">
            Please select an organization to view tenders.
          </p>
        </div>
      </div>
    );
  }

  const result = await getTenderById(session.activeOrganizationId, id);

  if (!result.success || !result.tender) {
    notFound();
  }

  return (
    <TenderDetails
      tender={result.tender}
      organizationId={session.activeOrganizationId}
    />
  );
}
