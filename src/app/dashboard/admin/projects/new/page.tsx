import { getClients } from '@/db/queries/clients';
import { getCategories } from '@/db/queries/categories';
import { getTenders } from '@/db/queries/tenders';

export default async function NewProjectPage() {
  const clients = await getClients();
  const categories = await getCategories();
  const tenders = (await getTenders()).filter((t) => t.status !== 'awarded');

  const { default: NewProjectClient } = await import(
    '@/components/projects/NewProjectClient'
  );
  return (
    <NewProjectClient
      clients={clients}
      categories={categories}
      tenders={tenders}
    />
  );
}
