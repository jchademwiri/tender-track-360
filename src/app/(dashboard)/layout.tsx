import Header from '@/components/header';
import { OrganizationProvider } from '@/components/organization-provider';
import { getOrganizationsForProvider } from '@/server/organizations';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const organizations = await getOrganizationsForProvider();

  return (
    <OrganizationProvider organizations={organizations}>
      <Header />
      {children}
      <footer className=" py-4 text-center">Footer</footer>
    </OrganizationProvider>
  );
}
