import { CreateorganizationForm } from '@/components/forms';
import { Button } from '@/components/ui/button';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { getorganizations } from '@/server';
import Link from 'next/link';

export default async function Dashboard() {
  const organizations = await getorganizations();
  return (
    <section className="grid place-items-center min-h-[600px] text-center">
      <div>
        <div>
          <h1 className="text-4xl font-bold">Tender Track 360</h1>
          <p className="mt-4 text-lg">Welcome to Tender Track 360!</p>
        </div>
        <section className="my-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant={'outline'} className="cursor-pointer">
                Create organization
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create organization</DialogTitle>
                <DialogDescription>
                  Please fill in the details to create a new organization.
                </DialogDescription>
              </DialogHeader>
              <CreateorganizationForm />
            </DialogContent>
          </Dialog>
          <hr className="my-6" />
          <section className="">
            <h2 className="text-2xl py-2 font-bold">Your organizations</h2>
            <div className="grid grid-cols-1 gap-4">
              {organizations.map((org) => (
                <Button key={org.id} asChild variant={'outline'}>
                  <Link href={`/dashboard/organization/${org.slug}`}>
                    {org.name}
                  </Link>
                </Button>
              ))}
            </div>
          </section>
        </section>
      </div>
    </section>
  );
}
