import Header from '@/components/header';

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <div className="pt-20">{children}</div>
      <footer className="py-4 text-center">
        <div className="text-sm text-muted-foreground">
          Tender Track 360 - Profile Management
        </div>
      </footer>
    </>
  );
}
