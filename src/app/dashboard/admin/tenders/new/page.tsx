import { getClients } from '@/db/queries/clients';
import { getCategories } from '@/db/queries/categories';
import { TenderForm } from '@/components/tenders/TenderForm';

export default async function NewTenderPage() {
  const { clients } = await getClients();
  const { categories } = await getCategories();

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Create New Tender
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Fill out the form below to add a new tender.
        </p>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <TenderForm clients={clients} categories={categories} />
      </div>
    </div>
  );
}
