'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PencilIcon, TrashIcon, ShieldAlert } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface CategoryActionsProps {
  categoryId: string;
  categoryName: string;
}

export function CategoryActions({
  categoryId,
  categoryName,
}: CategoryActionsProps) {
  const router = useRouter();
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete "${categoryName}"?`)) {
      try {
        const response = await fetch(`/api/categories/${categoryId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          const { error } = await response.json();
          throw new Error(error || 'Failed to delete category');
        }

        toast.success('Category deleted successfully.');
        router.refresh();
      } catch (error) {
        if (
          error instanceof Error &&
          error.message.includes('assigned to one or more tenders')
        ) {
          setErrorMessage(error.message);
          setShowErrorDialog(true);
        } else {
          toast.error(
            error instanceof Error
              ? error.message
              : 'An unknown error occurred.'
          );
        }
      }
    }
  };

  return (
    <>
      <div className="flex items-center justify-end gap-2">
        <Link
          href={`/dashboard/admin/categories/${categoryId}/edit`}
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

      <AlertDialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <ShieldAlert className="text-red-500" />
              Deletion Failed
            </AlertDialogTitle>
            <AlertDialogDescription>{errorMessage}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowErrorDialog(false)}>
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
