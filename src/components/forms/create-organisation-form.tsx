'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { authClient } from '@/lib/auth-client';
import { toast } from 'sonner';
import { useState } from 'react';
import { Loader } from 'lucide-react';

const createOrganisationFormSchema = z.object({
  name: z.string().min(2).max(50),
  slug: z.string().min(2).max(50),
});

export function CreateOrganisationForm() {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof createOrganisationFormSchema>>({
    resolver: zodResolver(createOrganisationFormSchema),
    defaultValues: {
      name: '',
      slug: '',
    },
  });

  async function onSubmit(
    values: z.infer<typeof createOrganisationFormSchema>
  ) {
    setIsLoading(true);
    try {
      await authClient.organization.create({
        name: values.name, // required
        slug: values.slug, // required
        logo: 'https://example.com/logo.png',
        keepCurrentActiveOrganization: false,
      });
      toast.success('Organisation created successfully!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to create organisation.');
    } finally {
      setIsLoading(false);
    }
    // console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="My Organisation" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input placeholder="my-organisation" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={!form.formState.isValid || isLoading} type="submit">
          {isLoading ? (
            <Loader className="size-4 animate-spin" />
          ) : (
            'Create Organisation'
          )}
        </Button>
      </form>
    </Form>
  );
}
