import { getCurrentUser } from '@/server';
import { getPurchaseOrderById } from '@/server/purchase-orders';
import { PODetails } from '@/components/purchase-orders/po-details';

export const dynamic = 'force-dynamic';

interface PurchaseOrderPageProps {
  params: Promise<{ id: string }>;
}

export default async function PurchaseOrderPage({ params }: PurchaseOrderPageProps) {
  const { id } = await params;
  const { session } = await getCurrentUser();

  if (!session.activeOrganizationId) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">
            No Organization Selected
          </h2>
          <p className="text-gray-600">
            Please select an organization to view purchase orders.
          </p>
        </div>
      </div>
    );
  }

  const result = await getPurchaseOrderById(session.activeOrganizationId, id);

  if (!result.success || !result.purchaseOrder) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">
            Purchase Order Not Found
          </h2>
          <p className="text-gray-600">
            The purchase order you&apos;re looking for doesn&apos;t exist or you don&apos;t have access to it.
          </p>
        </div>
      </div>
    );
  }

  return <PODetails po={result.purchaseOrder} organizationId={session.activeOrganizationId} />;
}