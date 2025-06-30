import Link from 'next/link';
import { PlusIcon, FolderIcon } from 'lucide-react';
import { CategoryActions } from './CategoryActions';
import { getCategories } from '@/db/queries/categories';

export default async function CategoriesPage() {
  const allCategories = await getCategories();

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <FolderIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Categories</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage tender categories ({allCategories.length} total)
            </p>
          </div>
        </div>
        <Link
          href="/dashboard/admin/categories/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm"
        >
          <PlusIcon className="w-4 h-4" />
          Add Category
        </Link>
      </div>

      {/* Categories Grid/Table */}
      {allCategories.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
          <FolderIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            No categories yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Get started by creating your first tender category.
          </p>
          <Link
            href="/dashboard/admin/categories/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            <PlusIcon className="w-4 h-4" />
            Create Category
          </Link>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Category Name
                  </th>
                  {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    ID
                  </th> */}
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {allCategories.map((category) => (
                  <tr
                    key={category.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mr-3">
                          <FolderIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {category.name}
                        </div>
                      </div>
                    </td>
                    {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      #{category.id}
                    </td> */}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <CategoryActions categoryName={category.name} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Footer Stats */}
      {allCategories.length > 0 && (
        <div className="mt-6 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <div>
            Showing {allCategories.length} categor
            {allCategories.length === 1 ? 'y' : 'ies'}
          </div>
          <div className="flex items-center gap-4">
            <span>Last updated: {new Date().toLocaleDateString()}</span>
          </div>
        </div>
      )}
    </div>
  );
}
