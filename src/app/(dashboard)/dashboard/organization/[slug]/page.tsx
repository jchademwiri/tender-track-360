import { getOrganizationBySlug } from '@/server';

type Params = Promise<{ slug: string }>;

export default async function OrganisationDetails({
  params,
}: {
  params: Params;
}) {
  const { slug } = await params;
  const organisation = await getOrganizationBySlug(slug);
  if (!organisation) {
    return (
      <section className="grid place-items-center min-h-[600px] text-center">
        <h1 className="text-4xl font-bold">Organisation Not Found</h1>
      </section>
    );
  }

  return (
    <section className="grid place-items-center min-h-[600px] text-center">
      <h1 className="text-4xl font-bold">Organisation Details</h1>
      <p className="mt-4 text-lg"> {organisation.name}</p>
    </section>
  );
}
