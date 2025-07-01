'use client';

import { useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { tenderStatusEnum } from '@/db/schema/enums';
import { toast } from 'sonner';
import { badgeVariants } from '@/components/ui/badge';

interface TenderStatusToggleProps {
  tenderId: string;
  currentStatus: keyof typeof tenderStatusEnum.enumValues;
  badgeVariant?: string;
  icon?: ReactNode;
}

export function TenderStatusToggle({
  tenderId,
  currentStatus,
  badgeVariant = 'default',
  icon,
}: TenderStatusToggleProps) {
  const router = useRouter();
  const [status, setStatus] =
    useState<keyof typeof tenderStatusEnum.enumValues>(currentStatus);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (
    newStatus: keyof typeof tenderStatusEnum.enumValues
  ) => {
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/tenders/${tenderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      setStatus(newStatus);
      toast.success('Tender status updated successfully.');
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'An unknown error occurred.'
      );
      setStatus(currentStatus);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Select
      onValueChange={handleStatusChange}
      value={status}
      disabled={isUpdating}
    >
      <SelectTrigger
        className={
          badgeVariants({ variant: badgeVariant }) +
          ' w-[120px] flex items-center gap-1'
        }
      >
        {icon}
        <SelectValue placeholder="Select status" />
      </SelectTrigger>
      <SelectContent>
        {tenderStatusEnum.enumValues.map((enumValue) => (
          <SelectItem key={enumValue} value={enumValue}>
            {enumValue.charAt(0).toUpperCase() + enumValue.slice(1)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
