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
import { useState, useRef } from 'react';
import { Loader } from 'lucide-react';

const createOrganisationFormSchema = z.object({
  name: z.string().min(2).max(50),
  slug: z.string().min(2).max(50),
});

export function CreateOrganisationForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [slugManuallyChanged, setSlugManuallyChanged] = useState(false);
  const [slugEditable, setSlugEditable] = useState(false);
  const nameRef = useRef('');

  const form = useForm<z.infer<typeof createOrganisationFormSchema>>({
    resolver: zodResolver(createOrganisationFormSchema),
    defaultValues: {
      name: '',
      slug: '',
    },
  });

  // Slugify helper
  function slugify(text: string) {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

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
                <Input
                  placeholder="My Organisation"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    nameRef.current = e.target.value;
                    if (!slugManuallyChanged) {
                      form.setValue('slug', slugify(e.target.value), {
                        shouldValidate: true,
                      });
                    }
                  }}
                />
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
              <div className="flex items-center gap-2">
                <FormControl>
                  <Input
                    placeholder="my-organisation"
                    {...field}
                    disabled={!slugEditable}
                    onChange={(e) => {
                      field.onChange(e);
                      setSlugManuallyChanged(
                        e.target.value !== slugify(nameRef.current)
                      );
                    }}
                  />
                </FormControl>
                {!slugEditable && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setSlugEditable(true)}
                  >
                    Edit
                  </Button>
                )}
              </div>
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
