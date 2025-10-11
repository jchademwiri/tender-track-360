import { getCurrentUser } from '@/server';
import { getPurchaseOrderById } from '@/server/purchase-orders';
import { POForm } from '@/components/purchase-orders/po-form';

interface EditPurchaseOrderPageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = 'force-dynamic';

export default async function EditPurchaseOrderPage({ params }: EditPurchaseOrderPageProps) {
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
            Please select an organization to edit purchase orders.
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
            The purchase order you&apos;re trying to edit doesn&apos;t exist or you don&apos;t have access to it.
          </p>
        </div>
      </div>
    );
  }

  const po = result.purchaseOrder;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Purchase Order</h1>
        <p className="text-muted-foreground">
          Update purchase order {po.poNumber} details.
        </p>
      </div>

      <POForm
        organizationId={session.activeOrganizationId}
        initialData={{
          id: po.id,
          poNumber: po.poNumber,
          projectId: po.project?.id || '',
          supplierName: po.supplierName || undefined,
          description: po.description,
          totalAmount: po.totalAmount,
          status: po.status as 'draft' | 'sent' | 'delivered',
          poDate: po.poDate || undefined,
          expectedDeliveryDate: po.expectedDeliveryDate || undefined,
          notes: po.notes || undefined,
        }}
      />
    </div>
  );
}