'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Building2, Save, Upload, Trash2, Camera } from 'lucide-react';
import { toast } from 'sonner';
import type { Role } from '@/db/schema';

interface GeneralTabProps {
  organization: {
    id: string;
    name: string;
    slug?: string | null;
    logo?: string | null;
    metadata?: string | null;
    createdAt: Date;
  };
  userRole: Role;
  currentUser: {
    id: string;
    name: string;
    email: string;
  };
}

// Form schema for organization details
const organizationSchema = z.object({
  name: z.string().min(2, 'Organization name must be at least 2 characters'),
  description: z.string().optional(),
  logo: z.string().url().optional().or(z.literal('')),
  website: z.string().url().optional().or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().optional(),
});

type OrganizationFormData = z.infer<typeof organizationSchema>;

// Helper function to check if user can edit
function canEditOrganization(role: Role): boolean {
  return ['owner', 'admin', 'manager'].includes(role);
}

// Helper function to get organization initials
function getOrganizationInitials(name: string): string {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function GeneralTab({
  organization,
  userRole,
  currentUser,
}: GeneralTabProps) {
  const [isLoading, setIsLoading] = useState(false);
  const canEdit = canEditOrganization(userRole);

  // Parse metadata if it exists
  const metadata = organization.metadata
    ? JSON.parse(organization.metadata)
    : {};

  const form = useForm<OrganizationFormData>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      name: organization.name,
      description: metadata.description || '',
      logo: organization.logo || '',
      website: metadata.website || '',
      phone: metadata.phone || '',
      address: metadata.address || '',
    },
  });

  const onSubmit = async (data: OrganizationFormData) => {
    if (!canEdit) {
      toast.error('You do not have permission to edit this organization');
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Implement updateOrganizationDetails server action
      // For now, simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log('Organization update data:', {
        organizationId: organization.id,
        name: data.name,
        logo: data.logo,
        metadata: {
          description: data.description,
          website: data.website,
          phone: data.phone,
          address: data.address,
        },
      });

      toast.success('Organization updated successfully', {
        description: 'Your organization details have been saved.',
      });
    } catch (error) {
      console.error('Error updating organization:', error);
      toast.error('Failed to update organization', {
        description: 'Please try again later.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Organization Logo Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Organization Logo
          </CardTitle>
          <CardDescription>
            Update your organization&apos;s logo and visual identity
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="h-24 w-24">
              <AvatarImage
                src={organization.logo || ''}
                alt={`${organization.name} logo`}
              />
              <AvatarFallback className="text-lg bg-primary/10">
                {getOrganizationInitials(organization.name)}
              </AvatarFallback>
            </Avatar>
            {canEdit && (
              <div className="flex gap-2">
                <Button type="button" size="sm" variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Logo
                </Button>
                {organization.logo && (
                  <Button type="button" size="sm" variant="outline">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Organization Details Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Organization Details
          </CardTitle>
          <CardDescription>
            {canEdit
              ? 'Update your organization information and contact details'
              : 'View organization information and contact details'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Organization Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter organization name"
                          disabled={!canEdit}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        This is your organization&apos;s display name.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website</FormLabel>
                      <FormControl>
                        <Input
                          type="url"
                          placeholder="https://www.example.com"
                          disabled={!canEdit}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Your organization&apos;s website URL.
                      </FormDescription>
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
                        placeholder="Describe your organization..."
                        className="min-h-[100px]"
                        disabled={!canEdit}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      A brief description of your organization and what you do.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          placeholder="+1 (555) 123-4567"
                          disabled={!canEdit}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Primary contact phone number.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="logo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Logo URL</FormLabel>
                      <FormControl>
                        <Input
                          type="url"
                          placeholder="https://example.com/logo.png"
                          disabled={!canEdit}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Direct URL to your organization logo.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Address</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="123 Business Street, City, State, ZIP Code"
                        className="min-h-[80px]"
                        disabled={!canEdit}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Your organization&apos;s primary business address.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {canEdit && (
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full sm:w-auto"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Update Organization
                      </>
                    )}
                  </Button>
                </div>
              )}

              {!canEdit && (
                <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                  You have read-only access to this organization. Contact an
                  admin or owner to make changes.
                </div>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
