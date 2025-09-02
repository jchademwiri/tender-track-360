'use client';

import Link from 'next/link';
import { useOrganization } from '@/hooks/use-organization';

interface OrgAwareLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  replace?: boolean;
}

export function OrgAwareLink({
  href,
  children,
  className,
  replace = false,
}: OrgAwareLinkProps) {
  const { getOrgUrl } = useOrganization();

  const finalHref = getOrgUrl(href);

  return (
    <Link href={finalHref} className={className} replace={replace}>
      {children}
    </Link>
  );
}
