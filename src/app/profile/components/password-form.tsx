'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
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
import { Progress } from '@/components/ui/progress';
import {
  Eye,
  EyeOff,
  Lock,
  Save,
  X,
  Loader2,
  Check,
  AlertCircle,
} from 'lucide-react';

// Password strength validation schema
const passwordFormSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(
        /[^a-zA-Z0-9]/,
        'Password must contain at least one special character'
      ),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    signOutOtherSessions: z.boolean().default(false),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type PasswordFormData = z.infer<typeof passwordFormSchema>;

interface PasswordFormProps {
  onSubmit: (
    data: PasswordFormData
  ) => Promise<{ success: boolean; message: string; data?: unknown }>;
}

// Password strength calculation
const calculatePasswordStrength = (password: string): number => {
  let score = 0;

  if (password.length >= 8) score += 20;
  if (password.length >= 12) score += 10;
  if (/[a-z]/.test(password)) score += 20;
  if (/[A-Z]/.test(password)) score += 20;
  if (/[0-9]/.test(password)) score += 15;
  if (/[^a-zA-Z0-9]/.test(password)) score += 15;

  return Math.min(score, 100);
};

const getPasswordStrengthLabel = (
  strength: number
): { label: string; color: string } => {
  if (strength < 40) return { label: 'Weak', color: 'text-red-500' };
  if (strength < 70) return { label: 'Fair', color: 'text-yellow-500' };
  if (strength < 90) return { label: 'Good', color: 'text-blue-500' };
  return { label: 'Strong', color: 'text-green-500' };
};

export function PasswordForm({ onSubmit }: PasswordFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<PasswordFormData>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      signOutOtherSessions: false,
    },
  });

  const newPassword = form.watch('newPassword');
  const passwordStrength = newPassword
    ? calculatePasswordStrength(newPassword)
    : 0;
  const strengthInfo = getPasswordStrengthLabel(passwordStrength);

  const handleSubmit = async (data: PasswordFormData) => {
    startTransition(async () => {
      try {
        const result = await onSubmit(data);

        if (result.success) {
          toast.success(result.message);
          setIsEditing(false);
          form.reset();
        } else {
          toast.error(result.message);

          // Handle field-specific errors
          if (result.data) {
            Object.entries(result.data).forEach(([field, errors]) => {
              if (Array.isArray(errors) && errors.length > 0) {
                form.setError(field as keyof PasswordFormData, {
                  type: 'server',
                  message: errors[0],
                });
              }
            });
          }
        }
      } catch (error) {
        toast.error('An unexpected error occurred. Please try again.');
        console.error('Password change failed:', error);
      }
    });
  };

  const handleCancel = () => {
    form.reset();
    setIsEditing(false);
  };

  // Password requirements checklist
  const passwordRequirements = [
    { test: (pwd: string) => pwd.length >= 8, label: 'At least 8 characters' },
    { test: (pwd: string) => /[a-z]/.test(pwd), label: 'One lowercase letter' },
    { test: (pwd: string) => /[A-Z]/.test(pwd), label: 'One uppercase letter' },
    { test: (pwd: string) => /[0-9]/.test(pwd), label: 'One number' },
    {
      test: (pwd: string) => /[^a-zA-Z0-9]/.test(pwd),
      label: 'One special character',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Lock className="h-5 w-5" />
            <span>Password & Security</span>
          </CardTitle>
          {!isEditing && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              disabled={isPending}
            >
              <Lock className="h-4 w-4" />
              Change Password
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {!isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Password
              </label>
              <p className="mt-1 text-sm">
                Your password was last updated recently. Click &quot;Change
                Password&quot; to update it.
              </p>
            </div>
          </div>
        ) : (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
            >
              {/* Current Password */}
              <FormField
                control={form.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showCurrentPassword ? 'text' : 'password'}
                          disabled={isPending}
                          placeholder="Enter your current password"
                          className="pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() =>
                            setShowCurrentPassword(!showCurrentPassword)
                          }
                          disabled={isPending}
                        >
                          {showCurrentPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormDescription>
                      Enter your current password to verify your identity
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* New Password */}
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showNewPassword ? 'text' : 'password'}
                          disabled={isPending}
                          placeholder="Enter your new password"
                          className="pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          disabled={isPending}
                        >
                          {showNewPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>

                    {/* Password Strength Indicator */}
                    {newPassword && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            Password strength:
                          </span>
                          <span
                            className={`text-sm font-medium ${strengthInfo.color}`}
                          >
                            {strengthInfo.label}
                          </span>
                        </div>
                        <Progress value={passwordStrength} className="h-2" />
                      </div>
                    )}

                    {/* Password Requirements */}
                    {newPassword && (
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">
                          Requirements:
                        </p>
                        <div className="grid grid-cols-1 gap-1">
                          {passwordRequirements.map((req, index) => {
                            const isValid = req.test(newPassword);
                            return (
                              <div
                                key={index}
                                className={`flex items-center space-x-2 text-xs ${
                                  isValid
                                    ? 'text-green-600'
                                    : 'text-muted-foreground'
                                }`}
                              >
                                {isValid ? (
                                  <Check className="h-3 w-3" />
                                ) : (
                                  <AlertCircle className="h-3 w-3" />
                                )}
                                <span>{req.label}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Confirm Password */}
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm New Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showConfirmPassword ? 'text' : 'password'}
                          disabled={isPending}
                          placeholder="Confirm your new password"
                          className="pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          disabled={isPending}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormDescription>
                      Re-enter your new password to confirm
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Session Management Option */}
              <FormField
                control={form.control}
                name="signOutOtherSessions"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isPending}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Sign out other sessions</FormLabel>
                      <FormDescription>
                        Sign out all other devices and sessions after changing
                        your password. This is recommended for security.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              {/* Action Buttons */}
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
                  <span>
                    {isPending ? 'Changing Password...' : 'Change Password'}
                  </span>
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
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
}
