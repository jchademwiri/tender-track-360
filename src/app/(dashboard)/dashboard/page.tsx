import { CreateOrganisationForm } from '@/components/forms';
import { Button } from '@/components/ui/button';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { getCurrentUser, getOrganisations } from '@/server';

export default async function Dashboard() {
  return (
    <section className="grid place-items-center min-h-[600px] text-center">
      <div>
        <hr className="my-6" />
        <div>
          <h1 className="text-4xl font-bold">Tender Track 360</h1>
          <p className="mt-4 text-lg">Welcome to Tender Track 360!</p>
        </div>
        <section className="my-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant={'outline'} className="cursor-pointer">
                Create Organisation
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Organisation</DialogTitle>
                <DialogDescription>
                  Please fill in the details to create a new organisation.
                </DialogDescription>
              </DialogHeader>
              <CreateOrganisationForm />
            </DialogContent>
          </Dialog>
        </section>
      </div>
    </section>
  );
}
