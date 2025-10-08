import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreateorganizationForm } from '@/components/shared/forms/create-organization-form';

export const dynamic = 'force-dynamic';

export default function CreateOrganizationPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-2xl">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">
              Create a new Organization
            </CardTitle>
            <p className="text-muted-foreground">
              Set up your organization to get started
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <CreateorganizationForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
