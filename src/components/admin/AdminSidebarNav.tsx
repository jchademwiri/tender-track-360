import Link from 'next/link';

const navLinks = [
  { href: '/dashboard/admin/tenders', label: 'Tenders' },
  { href: '/dashboard/admin/clients', label: 'Clients' },
  { href: '/dashboard/admin/users', label: 'Users' },
  { href: '/dashboard/admin/reports', label: 'Reports' },
  { href: '/dashboard/admin/categories', label: 'Categories' },
];

export function AdminSidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex-1 space-y-2">
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="block px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100 font-medium"
          onClick={onNavigate}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
