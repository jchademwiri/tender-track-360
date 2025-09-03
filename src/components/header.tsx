import { getorganizations } from '@/server';
import { OrganizationSwitcher } from '@/components/organization-switcher';
import { OrgAwareLink } from '@/components/org-aware-link';
import Logout from '@/components/ui/logout';
import { ThemeSwitcher } from '@/components/theme-switcher';

export default async function Header() {
  const organizations = await getorganizations();
  return (
    <header className="absolute top-0 right-0 flex justify-between items-center p-4 w-full">
      <OrganizationSwitcher organizations={organizations} />
      <div className="flex items-center gap-2">
        <OrgAwareLink href="/dashboard">Dashboard</OrgAwareLink>
        <OrgAwareLink href="/profile">Profile</OrgAwareLink>
        <Logout />
        <ThemeSwitcher />
      </div>
    </header>
  );
}
