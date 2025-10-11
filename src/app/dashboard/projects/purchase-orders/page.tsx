import { getCurrentUser } from '@/server';
import { getPurchaseOrders } from '@/server/purchase-orders';
import Link from 'next/link';

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

  // Fetch purchase orders
  const result = await getPurchaseOrders(session.activeOrganizationId, '', 1, 10);

  const purchaseOrders = result.purchaseOrders;
  const totalCount = result.totalCount;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Purchase Orders</h1>
        <p className="text-muted-foreground">
          Track and manage all purchase orders to prevent duplicate orders and
          ensure proper fulfillment.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-muted/50 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-2">Total POs</h2>
          <p className="text-3xl font-bold text-blue-600">{totalCount}</p>
          <p className="text-sm text-muted-foreground">All purchase orders</p>
        </div>

        <div className="bg-muted/50 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-2">Active POs</h2>
          <p className="text-3xl font-bold text-green-600">
            {purchaseOrders.filter(po => po.status === 'draft' || po.status === 'sent').length}
          </p>
          <p className="text-sm text-muted-foreground">Draft and sent</p>
        </div>

        <div className="bg-muted/50 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-2">Fulfilled</h2>
          <p className="text-3xl font-bold text-purple-600">
            {purchaseOrders.filter(po => po.status === 'delivered').length}
          </p>
          <p className="text-sm text-muted-foreground">Completed orders</p>
        </div>
      </div>

      <div className="bg-muted/50 rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Purchase Orders</h2>
          <Link
            href="/dashboard/projects/purchase-orders/create"
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm"
          >
            Add New PO
          </Link>
        </div>

        {purchaseOrders.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No purchase orders found.</p>
            <Link
              href="/dashboard/projects/purchase-orders/create"
              className="text-primary hover:underline mt-2 inline-block"
            >
              Create your first purchase order
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {purchaseOrders.map((po) => (
              <div key={po.id} className="bg-background rounded-lg p-4 border">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{po.supplierName}</h3>
                    <p className="text-sm text-muted-foreground">
                      {po.description}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Project: {po.project?.projectNumber} - {po.project?.description}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Created: {new Date(po.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs px-2 py-1 rounded ${
                      po.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      po.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {po.status}
                    </span>
                    <p className="text-sm font-medium mt-1">
                      R{parseFloat(po.totalAmount).toLocaleString('en-ZA')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
