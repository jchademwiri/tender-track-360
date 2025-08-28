import { AllUsers, MembersTable } from '@/components/tables';
import { getAllUsers, getOrganizationBySlug } from '@/server';

type Params = Promise<{ slug: string }>;

export default async function organizationDetails({
  params,
}: {
  params: Params;
}) {
  const { slug } = await params;

  const organization = await getOrganizationBySlug(slug);
  const users = await getAllUsers(organization?.id || '');

  if (!organization) {
    return (
      <section className="grid place-items-center min-h-[600px] text-center">
        <h1 className="text-4xl font-bold">organization Not Found</h1>
      </section>
    );
  }

  return (
    <section className="flex max-w-3xl gap-4 flex-col py-16 mx-auto">
      <h1 className="text-3xl font-bold">{organization.name}</h1>
      <MembersTable members={organization?.members || []} />
      <AllUsers users={users} organizationId={organization.id} />
    </section>

    // https://youtu.be/QN2ljJ5MjV4?list=PLb3Vtl4F8GHTUJ_RmNINhE6GxB97otFzS&t=865
  );
}
