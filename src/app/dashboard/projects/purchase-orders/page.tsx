export const dynamic = 'force-dynamic';

export default async function PurchaseOrdersPage() {
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
          <h2 className="text-xl font-semibold mb-2">Open POs</h2>
          <p className="text-3xl font-bold text-blue-600">23</p>
          <p className="text-sm text-muted-foreground">Awaiting fulfillment</p>
        </div>

        <div className="bg-muted/50 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-2">Fulfilled</h2>
          <p className="text-3xl font-bold text-green-600">156</p>
          <p className="text-sm text-muted-foreground">This year</p>
        </div>

        <div className="bg-muted/50 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-2">Overdue</h2>
          <p className="text-3xl font-bold text-red-600">3</p>
          <p className="text-sm text-muted-foreground">Need attention</p>
        </div>
      </div>

      <div className="bg-muted/50 rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Recent Purchase Orders</h2>
          <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm">
            Add New PO
          </button>
        </div>

        <div className="space-y-3">
          <div className="bg-background rounded-lg p-4 border">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">PO-2024-158</h3>
                <p className="text-sm text-muted-foreground">
                  Steel beams for Office Building
                </p>
                <p className="text-sm text-muted-foreground">
                  Created: Dec 18, 2024
                </p>
              </div>
              <div className="text-right">
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                  Open
                </span>
                <p className="text-sm font-medium mt-1">$15,420</p>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-lg p-4 border">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">PO-2024-157</h3>
                <p className="text-sm text-muted-foreground">
                  Electrical supplies for Warehouse
                </p>
                <p className="text-sm text-muted-foreground">
                  Created: Dec 15, 2024
                </p>
              </div>
              <div className="text-right">
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                  Fulfilled
                </span>
                <p className="text-sm font-medium mt-1">$8,750</p>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-lg p-4 border border-red-200">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">PO-2024-145</h3>
                <p className="text-sm text-muted-foreground">
                  Concrete for Foundation Project
                </p>
                <p className="text-sm text-muted-foreground">
                  Created: Nov 28, 2024
                </p>
              </div>
              <div className="text-right">
                <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                  Overdue
                </span>
                <p className="text-sm font-medium mt-1">$22,100</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
