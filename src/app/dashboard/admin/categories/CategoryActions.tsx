'use client';

import Link from 'next/link';
import { PencilIcon, TrashIcon } from 'lucide-react';

interface CategoryActionsProps {
  // categoryId: number;
  categoryName: string;
}

export function CategoryActions({
  // categoryId,
  categoryName,
}: CategoryActionsProps) {
  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete "${categoryName}"?`)) {
      // Handle delete action - you can implement the actual delete logic here
      // console.log('Delete category:', categoryId);
      // You might want to call a server action or API route here
      // Example: deleteCategory(categoryId);
    }
  };

  return (
    <div className="flex items-center justify-end gap-2">
      <Link
        href={`/dashboard/admin/categories/${categoryName}/edit`}
        className="inline-flex items-center p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
        title="Edit category"
      >
        <PencilIcon className="w-4 h-4" />
      </Link>
      <button
        className="inline-flex items-center p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
        title="Delete category"
        onClick={handleDelete}
      >
        <TrashIcon className="w-4 h-4" />
      </button>
    </div>
  );
}
