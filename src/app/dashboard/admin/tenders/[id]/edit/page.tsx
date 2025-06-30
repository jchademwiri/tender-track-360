import { getTenderById } from '@/db/queries/tenders';
import { getClients } from '@/db/queries/clients';
import { getCategories } from '@/db/queries/categories';
import { TenderForm } from '@/components/tenders/TenderForm';
import { notFound } from 'next/navigation';

interface EditTenderPageProps {
  params: {
    id: string;
  };
}

export default async function EditTenderPage({ params }: EditTenderPageProps) {
  const tenderData = getTenderById(params.id);
  const clientsData = getClients();
  const categoriesData = getCategories();

  const [tender, { clients }, { categories }] = await Promise.all([
    tenderData,
    clientsData,
    categoriesData,
  ]);

  if (!tender) {
    notFound();
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Edit Tender
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Update the details for &quot;{tender.title}&quot;.
        </p>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <TenderForm tender={tender} clients={clients} categories={categories} />
      </div>
    </div>
  );
}
