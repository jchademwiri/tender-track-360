'use client';

import { useState, useTransition, useOptimistic } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Save, X, Loader2 } from 'lucide-react';

// Validation schema for profile form
const profileFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must not exceed 50 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
});

type ProfileFormData = z.infer<typeof profileFormSchema>;

interface ProfileFormProps {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
  };
  onSubmit: (
    data: ProfileFormData
  ) => Promise<{ success: boolean; message: string; data?: unknown }>;
}

export function ProfileForm({ user, onSubmit }: ProfileFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Optimistic state for user data
  const [optimisticUser, updateOptimisticUser] = useOptimistic(
    user,
    (state, newName: string) => ({
      ...state,
      name: newName,
    })
  );

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user.name,
    },
  });

  const handleSubmit = async (data: ProfileFormData) => {
    startTransition(async () => {
      // Start optimistic update inside the transition
      updateOptimisticUser(data.name);

      try {
        const result = await onSubmit(data);

        if (result.success) {
          toast.success(result.message);
          setIsEditing(false);
          form.reset(data); // Reset form with new values
        } else {
          // Revert optimistic update on error
          updateOptimisticUser(user.name);
          toast.error(result.message);

          // Handle field-specific errors
          if (result.data) {
            Object.entries(result.data).forEach(([field, errors]) => {
              if (Array.isArray(errors) && errors.length > 0) {
                form.setError(field as keyof ProfileFormData, {
                  type: 'server',
                  message: errors[0],
                });
              }
            });
          }
        }
      } catch (error) {
        // Revert optimistic update on error
        updateOptimisticUser(user.name);
        toast.error('An unexpected error occurred. Please try again.');
        console.error('Profile update failed:', error);
      }
    });
  };

  const handleCancel = () => {
    form.reset({ name: user.name }); // Reset to original values
    setIsEditing(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Profile Information</CardTitle>
          {!isEditing && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              disabled={isPending}
            >
              <Edit className="h-4 w-4" />
              Edit
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={!isEditing || isPending}
                      placeholder="Enter your full name"
                      value={isEditing ? field.value : optimisticUser.name}
                    />
                  </FormControl>
                  <FormDescription>
                    Your display name (2-50 characters, letters and spaces only)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email field - read-only for now */}
            <div className="space-y-2">
              <FormLabel>Email Address</FormLabel>
              <Input
                value={optimisticUser.email}
                disabled
                className="bg-muted"
              />
              <FormDescription>
                Email address cannot be changed from this form
              </FormDescription>
            </div>

            {isEditing && (
              <div className="flex items-center space-x-2 pt-4">
                <Button
                  type="submit"
                  disabled={isPending || !form.formState.isDirty}
                  className="flex items-center space-x-2"
                >
                  {isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  <span>{isPending ? 'Saving...' : 'Save Changes'}</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isPending}
                  className="flex items-center space-x-2"
                >
                  <X className="h-4 w-4" />
                  <span>Cancel</span>
                </Button>
              </div>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
