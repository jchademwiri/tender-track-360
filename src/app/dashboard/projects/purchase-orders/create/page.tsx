import { getCurrentUser } from '@/server';
import { POForm } from '@/components/purchase-orders/po-form';

export const dynamic = 'force-dynamic';

export default async function NewPurchaseOrderPage() {
  const { session } = await getCurrentUser();

  if (!session.activeOrganizationId) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">
            No Organization Selected
          </h2>
          <p className="text-gray-600">
            Please select an organization to create purchase orders.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Purchase Order</h1>
        <p className="text-muted-foreground">
          Create a new purchase order for a project. All purchase orders must be linked to a specific project.
        </p>
      </div>

      <POForm organizationId={session.activeOrganizationId} />
    </div>
  );
}