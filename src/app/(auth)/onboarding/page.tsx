'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSession, createOrganization } from '@/lib/auth-client';
import { toast } from 'sonner';
import { completeOnboarding } from './actions';

export default function OnboardingPage() {
  const [isCreating, setIsCreating] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    organizationName: '',
    organizationSlug: '',
    organizationType: '',
    description: '',
    industry: '',
    size: '',
    country: '',
    website: '',
  });

  const router = useRouter();
  const { data: session, isPending } = useSession();

  // Check if user is verified and needs onboarding
  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push('/login');
      return;
    }

    if (!isPending && session?.user && !session.user.emailVerified) {
      router.push('/verify-email');
      return;
    }

    // TODO: Check if user already has an organization and redirect to dashboard
  }, [session, isPending, router]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Auto-generate slug from organization name
    if (field === 'organizationName') {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setFormData((prev) => ({
        ...prev,
        organizationSlug: slug,
      }));
    }
  };

  const handleCreateOrganization = async () => {
    if (!formData.organizationName.trim()) {
      toast.error('Organization name is required');
      return;
    }

    setIsCreating(true);

    try {
      console.log('🏢 Creating organization:', {
        name: formData.organizationName,
        slug: formData.organizationSlug,
      });

      const { data, error } = await createOrganization({
        name: formData.organizationName,
        slug: formData.organizationSlug,
        metadata: {
          type: formData.organizationType,
          description: formData.description,
          industry: formData.industry,
          size: formData.size,
          country: formData.country,
          website: formData.website,
        },
      });

      if (error) {
        console.error('❌ Organization creation failed:', error);
        toast.error(error.message || 'Failed to create organization');
        return;
      }

      console.log('✅ Organization created successfully:', data);

      // Complete user onboarding with user profile
      const profileResult = await completeOnboarding(data.id, 'admin');

      if (!profileResult.success) {
        console.error(
          '❌ Failed to complete user profile:',
          profileResult.error
        );
        toast.error(
          'Organization created but failed to setup profile. Please contact support.'
        );
        return;
      }

      console.log(
        '✅ User profile created successfully:',
        profileResult.userProfile
      );
      toast.success(
        'Organization created successfully! Welcome to Tender Track 360!'
      );

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('❌ Unexpected error creating organization:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const nextStep = () => {
    if (step === 1 && !formData.organizationName.trim()) {
      toast.error('Organization name is required');
      return;
    }
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  if (isPending) {
    return (
      <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-2xl">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Loading...</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground">
                Setting up your onboarding...
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-2xl">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">
              Welcome to Tender Track 360! 🎉
            </CardTitle>
            <p className="text-muted-foreground">
              Let&apos;s set up your organization and get you started
            </p>
            <div className="flex justify-center mt-4">
              <div className="flex space-x-2">
                <div
                  className={`w-8 h-2 rounded-full ${step >= 1 ? 'bg-primary' : 'bg-gray-200'}`}
                />
                <div
                  className={`w-8 h-2 rounded-full ${step >= 2 ? 'bg-primary' : 'bg-gray-200'}`}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Organization Details</h3>

                <div className="space-y-2">
                  <Label htmlFor="organizationName">Organization Name *</Label>
                  <Input
                    id="organizationName"
                    type="text"
                    placeholder="e.g., Acme Construction Ltd"
                    value={formData.organizationName}
                    onChange={(e) =>
                      handleInputChange('organizationName', e.target.value)
                    }
                    disabled={isCreating}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="organizationSlug">Organization Slug</Label>
                  <Input
                    id="organizationSlug"
                    type="text"
                    placeholder="acme-construction-ltd"
                    value={formData.organizationSlug}
                    onChange={(e) =>
                      handleInputChange('organizationSlug', e.target.value)
                    }
                    disabled={isCreating}
                  />
                  <p className="text-xs text-muted-foreground">
                    This will be used in your organization URL. Auto-generated
                    from name.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="organizationType">Organization Type</Label>
                  <Select
                    value={formData.organizationType}
                    onValueChange={(value) =>
                      handleInputChange('organizationType', value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select organization type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="construction">
                        Construction Company
                      </SelectItem>
                      <SelectItem value="consulting">
                        Consulting Firm
                      </SelectItem>
                      <SelectItem value="technology">
                        Technology Company
                      </SelectItem>
                      <SelectItem value="engineering">
                        Engineering Firm
                      </SelectItem>
                      <SelectItem value="government">
                        Government Agency
                      </SelectItem>
                      <SelectItem value="ngo">
                        Non-Profit Organization
                      </SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Brief description of your organization..."
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange('description', e.target.value)
                    }
                    disabled={isCreating}
                    rows={3}
                  />
                </div>

                <div className="flex justify-end">
                  <Button onClick={nextStep} disabled={isCreating}>
                    Next
                  </Button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">
                  Additional Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry</Label>
                    <Select
                      value={formData.industry}
                      onValueChange={(value) =>
                        handleInputChange('industry', value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="construction">
                          Construction
                        </SelectItem>
                        <SelectItem value="it">
                          Information Technology
                        </SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="government">Government</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="manufacturing">
                          Manufacturing
                        </SelectItem>
                        <SelectItem value="retail">Retail</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="size">Organization Size</Label>
                    <Select
                      value={formData.size}
                      onValueChange={(value) =>
                        handleInputChange('size', value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-10">1-10 employees</SelectItem>
                        <SelectItem value="11-50">11-50 employees</SelectItem>
                        <SelectItem value="51-200">51-200 employees</SelectItem>
                        <SelectItem value="201-500">
                          201-500 employees
                        </SelectItem>
                        <SelectItem value="500+">500+ employees</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Select
                      value={formData.country}
                      onValueChange={(value) =>
                        handleInputChange('country', value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ZA">South Africa</SelectItem>
                        <SelectItem value="US">United States</SelectItem>
                        <SelectItem value="GB">United Kingdom</SelectItem>
                        <SelectItem value="CA">Canada</SelectItem>
                        <SelectItem value="AU">Australia</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website">Website (Optional)</Label>
                    <Input
                      id="website"
                      type="url"
                      placeholder="https://example.com"
                      value={formData.website}
                      onChange={(e) =>
                        handleInputChange('website', e.target.value)
                      }
                      disabled={isCreating}
                    />
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <Button
                    variant="outline"
                    onClick={prevStep}
                    disabled={isCreating}
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleCreateOrganization}
                    disabled={isCreating}
                  >
                    {isCreating
                      ? 'Creating Organization...'
                      : 'Create Organization'}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
