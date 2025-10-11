import { getCurrentUser } from '@/server';
import { getPurchaseOrders } from '@/server/purchase-orders';
import { POList } from '@/components/purchase-orders/po-list';

export const dynamic = 'force-dynamic';

export default async function PurchaseOrdersPage() {
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

  // Fetch initial purchase orders for the list component
  const result = await getPurchaseOrders(session.activeOrganizationId, '', 1, 10);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Purchase Orders</h1>
        <p className="text-muted-foreground">
          Track and manage all purchase orders to prevent duplicate orders and
          ensure proper fulfillment.
        </p>
      </div>

      <POList
        organizationId={session.activeOrganizationId}
        initialPOs={result.purchaseOrders}
        initialTotalCount={result.totalCount}
      />
    </div>
  );
}
