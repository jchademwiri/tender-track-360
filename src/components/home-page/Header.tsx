import Link from 'next/link';
import AuthAwareNav from './AuthAwareNav';

export function Header() {
  return (
    <header className="absolute top-0 left-0 right-0 z-50 bg-transparent">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold text-foreground">
            Tender Track 360
          </span>
        </Link>

        <nav className="flex items-center gap-3">
          <AuthAwareNav />
        </nav>
      </div>
    </header>
  );
}
