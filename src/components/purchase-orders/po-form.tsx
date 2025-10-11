'use client';

import { useState, useTransition, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createPurchaseOrder, updatePurchaseOrder } from '@/server/purchase-orders';
import { getProjects } from '@/server/projects';

const poFormSchema = z.object({
  projectId: z.string().min(1, 'Project is required'),
  supplierName: z.string().min(1, 'Supplier name is required'),
  description: z.string().min(1, 'Description is required'),
  totalAmount: z.string().min(1, 'Total amount is required'),
  status: z.enum(['draft', 'sent', 'delivered']),
  expectedDeliveryDate: z.date().optional(),
  notes: z.string().optional(),
});

type POFormValues = z.infer<typeof poFormSchema>;

interface POFormProps {
  organizationId: string;
  initialData?: {
    id?: string;
    projectId: string;
    supplierName: string;
    description: string;
    totalAmount: string;
    status: 'draft' | 'sent' | 'delivered';
    expectedDeliveryDate?: Date;
    notes?: string;
  };
  onSuccess?: () => void;
}

export function POForm({ organizationId, initialData, onSuccess }: POFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [projects, setProjects] = useState<any[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  const form = useForm<POFormValues>({
    resolver: zodResolver(poFormSchema),
    defaultValues: {
      projectId: initialData?.projectId || '',
      supplierName: initialData?.supplierName || '',
      description: initialData?.description || '',
      totalAmount: initialData?.totalAmount || '',
      status: initialData?.status || 'draft',
      expectedDeliveryDate: initialData?.expectedDeliveryDate,
      notes: initialData?.notes || '',
    },
  });

  // Load projects on component mount
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const result = await getProjects(organizationId, '', 1, 100);
        setProjects(result.projects);
      } catch (error) {
        console.error('Error loading projects:', error);
      } finally {
        setLoadingProjects(false);
      }
    };

    loadProjects();
  }, [organizationId]);

  const onSubmit = async (data: POFormValues) => {
    startTransition(async () => {
      try {
        if (initialData?.id) {
          // Update existing PO
          const result = await updatePurchaseOrder(organizationId, initialData.id, data);
          if (result.success) {
            if (onSuccess) {
              onSuccess();
            } else {
              router.push('/dashboard/projects/purchase-orders');
            }
          } else {
            alert(result.error || 'Failed to update purchase order');
          }
        } else {
          // Create new PO
          const result = await createPurchaseOrder(organizationId, data);
          if (result.success) {
            if (onSuccess) {
              onSuccess();
            } else {
              router.push('/dashboard/projects/purchase-orders');
            }
          } else {
            alert(result.error || 'Failed to create purchase order');
          }
        }
      } catch (error) {
        console.error('Form submission error:', error);
        alert('An error occurred while saving the purchase order');
      }
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {initialData?.id ? 'Edit Purchase Order' : 'Create Purchase Order'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="projectId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={loadingProjects}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a project" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {loadingProjects ? (
                          <SelectItem value="loading" disabled>
                            Loading projects...
                          </SelectItem>
                        ) : projects.length === 0 ? (
                          <SelectItem value="none" disabled>
                            No projects available
                          </SelectItem>
                        ) : (
                          projects.map((project) => (
                            <SelectItem key={project.id} value={project.id}>
                              {project.projectNumber.toUpperCase()} - {project.description}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="supplierName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Supplier Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter supplier name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter purchase order description"
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="totalAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Amount *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="sent">Sent</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="expectedDeliveryDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expected Delivery Date</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                      value={field.value ? field.value.toISOString().split('T')[0] : ''}
                      onChange={(e) => {
                        const date = e.target.value ? new Date(e.target.value) : undefined;
                        field.onChange(date);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Additional notes (optional)"
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending
                  ? (initialData?.id ? 'Updating...' : 'Creating...')
                  : (initialData?.id ? 'Update Purchase Order' : 'Create Purchase Order')
                }
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}