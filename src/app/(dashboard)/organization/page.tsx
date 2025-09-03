import { CreateorganizationForm } from '@/components/forms';
import { Button } from '@/components/ui/button';
import { OrganizationSelector } from '@/components/organization-selector';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { getorganizations } from '@/server';

export default async function OrganizationPage() {
  const organizations = await getorganizations();

  const createOrgContent = (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Create New Organization</h3>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full">
            Create Organization
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Organization</DialogTitle>
            <DialogDescription>
              Please fill in the details to create a new organization.
            </DialogDescription>
          </DialogHeader>
          <CreateorganizationForm />
        </DialogContent>
      </Dialog>
    </div>
  );

  return (
    <OrganizationSelector
      organizations={organizations}
      fallbackContent={createOrgContent}
    />
  );
}
