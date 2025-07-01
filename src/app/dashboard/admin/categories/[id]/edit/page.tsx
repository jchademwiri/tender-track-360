import { CategoryForm } from '@/components/categories/category-form';
import { getCategoryById } from '@/db/queries/categories';
import { ChevronsLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface EditCategoryPageProps {
  params: {
    id: string;
  };
}

export default async function EditCategoryPage({
  params,
}: EditCategoryPageProps) {
  const category = await getCategoryById(params.id);

  if (!category) {
    notFound();
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <Link
        href="/dashboard/admin/categories"
        className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-6"
      >
        <ChevronsLeft className="w-4 h-4" />
        Back to Categories
      </Link>
      <h1 className="text-3xl font-bold text-foreground mb-1">Edit Category</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Update the details for the &quot;{category.name}&quot; category.
      </p>
      <CategoryForm category={category} />
    </div>
  );
}
