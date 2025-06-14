import { db } from '@/db';
import { tenderCategories } from '@/db/schema';

export default async function CategoriesPage() {
  const allCategories = await db.select().from(tenderCategories);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Categories</h1>
      <table className="min-w-full border border-gray-200 bg-white dark:bg-black">
        <thead>
          <tr>
            <th className="px-4 py-2 border-b">Name</th>
          </tr>
        </thead>
        <tbody>
          {allCategories.map((category) => (
            <tr
              key={category.id}
              className="hover:bg-gray-50 dark:hover:bg-gray-900"
            >
              <td className="px-4 py-2 border-b">{category.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
