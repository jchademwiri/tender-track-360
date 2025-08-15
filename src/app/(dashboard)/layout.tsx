import Logout from '@/components/ui/logout';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Logout />
      {children}
      <footer>Footer</footer>
    </>
  );
}
