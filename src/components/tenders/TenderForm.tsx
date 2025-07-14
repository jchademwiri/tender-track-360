'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { insertTenderSchema } from '@/db/schema/zod';
import { tenders } from '@/db/schema';
import { tenderStatusEnum } from '@/db/schema/enums';
import { toast } from 'sonner';

const formSchema = insertTenderSchema
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    createdById: true,
    updatedById: true,
    isDeleted: true,
    deletedAt: true,
    deletedById: true,
  })
  .refine(
    (data) => !!data.clientId && /^[0-9a-fA-F-]{36}$/.test(data.clientId),
    { message: 'Please select a client.', path: ['clientId'] }
  )
  .refine(
    (data) => !!data.categoryId && /^[0-9a-fA-F-]{36}$/.test(data.categoryId),
    { message: 'Please select a category.', path: ['categoryId'] }
  );

type TenderFormValues = Omit<
  typeof tenders.$inferInsert,
  | 'id'
  | 'createdAt'
  | 'updatedAt'
  | 'createdById'
  | 'updatedById'
  | 'isDeleted'
  | 'deletedAt'
  | 'deletedById'
>;

interface TenderFormProps {
  tender?: typeof tenders.$inferSelect;
  clients: { id: string; name: string }[];
  categories: { id: string; name: string }[];
}

export function TenderForm({ tender, clients, categories }: TenderFormProps) {
  const router = useRouter();
  const isEditing = !!tender;

  const form = useForm<TenderFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      referenceNumber: tender?.referenceNumber || '',
      title: tender?.title || '',
      description: tender?.description || '',
      clientId: tender?.clientId || '',
      categoryId: tender?.categoryId || '',
      status: tender?.status || 'open',
      publicationDate: tender?.publicationDate || undefined,
      submissionDeadline: tender?.submissionDeadline || undefined,
      evaluationDate: tender?.evaluationDate || undefined,
      awardDate: tender?.awardDate || undefined,
      estimatedValue: tender?.estimatedValue || '',
      actualValue: tender?.actualValue || '',
      department: tender?.department || '',
      notes: tender?.notes || '',
    },
  });

  const onSubmit = async (values: TenderFormValues) => {
    // Convert date fields to Date objects if they are strings
    const fixDate = (val: any) => {
      if (!val) return undefined;
      if (val instanceof Date) return val;
      // If it's an ISO string, parse to Date
      const d = new Date(val);
      if (!isNaN(d.getTime())) return d;
      // Try Date.parse for display strings
      if (typeof val === 'string') {
        const parsed = Date.parse(val);
        if (!isNaN(parsed)) return new Date(parsed);
      }
      return undefined;
    };
    const fixedValues: Record<string, any> = {
      ...values,
      publicationDate: fixDate(values.publicationDate),
      submissionDeadline: fixDate(values.submissionDeadline),
      evaluationDate: fixDate(values.evaluationDate),
      awardDate: fixDate(values.awardDate),
    };

    // Final cleanup: forcibly remove problematic fields
    delete fixedValues.createdAt;
    delete fixedValues.updatedAt;

    // If these are still numbers, forcibly convert to string or remove
    if (typeof fixedValues.estimatedValue === 'number') {
      fixedValues.estimatedValue = String(fixedValues.estimatedValue);
    }
    if (typeof fixedValues.actualValue === 'number') {
      fixedValues.actualValue = String(fixedValues.actualValue);
    }

    // Log the payload for debugging
    console.log('Tender payload:', fixedValues);

    try {
      const response = await fetch(
        isEditing ? `/api/tenders/${tender.id}` : '/api/tenders',
        {
          method: isEditing ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(fixedValues),
        }
      );
      if (!response.ok) {
        let errorMsg = `Failed to ${isEditing ? 'update' : 'create'} tender`;
        try {
          const errorData = await response.json();
          if (errorData?.error) {
            errorMsg = errorData.error;
            if (errorData.details) {
              if (Array.isArray(errorData.details)) {
                errorMsg +=
                  ': ' +
                  errorData.details.map((d: any) => d.message || d).join(', ');
              } else {
                errorMsg += ': ' + errorData.details;
              }
            }
          }
        } catch (err) {
          // If response is not JSON, keep the default errorMsg
        }
        toast.error(errorMsg);
        console.error('Tender API error:', errorMsg);
        return;
      }
      toast.success(
        `Tender ${isEditing ? 'updated' : 'created'} successfully.`
      );
      router.push('/dashboard/admin/tenders');
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'An unknown error occurred.'
      );
      console.error('Tender form submission error:', error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. Construction of New Bridge"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="referenceNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reference Number</FormLabel>
                <FormControl>
                  <Input placeholder="TDR-2024-001" {...field} />
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
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {tenderStatusEnum.enumValues.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="clientId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Client</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a client" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value ?? undefined}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="estimatedValue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estimated Value</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="100000.00"
                    {...field}
                    value={field.value ?? ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="actualValue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Actual Value</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="95000.00"
                    {...field}
                    value={field.value ?? ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="publicationDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Publication Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-full pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value ? (
                          format(field.value, 'PPP')
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ?? undefined}
                      onSelect={(date) => field.onChange(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="submissionDeadline"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Submission Deadline</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-full pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value ? (
                          format(field.value, 'PPP')
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ?? undefined}
                      onSelect={(date) => field.onChange(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="evaluationDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Evaluation Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-full pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value ? (
                          format(field.value, 'PPP')
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ?? undefined}
                      onSelect={(date) => field.onChange(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="awardDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Award Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-full pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value ? (
                          format(field.value, 'PPP')
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ?? undefined}
                      onSelect={(date) => field.onChange(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
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
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Provide a detailed description of the tender."
                  {...field}
                  value={field.value ?? ''}
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
              <FormLabel>Internal Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Add any internal notes here."
                  {...field}
                  value={field.value ?? ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting
            ? 'Saving...'
            : isEditing
            ? 'Save Changes'
            : 'Create Tender'}
        </Button>
      </form>
    </Form>
  );
}
