import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Logout from '../ui/logout';

interface HeaderProps {
  isAuthenticated: boolean;
  userName?: string;
}

export function Header({ isAuthenticated, userName }: HeaderProps) {
  return (
    <header className="absolute top-0 left-0 right-0 z-50 bg-transparent">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold text-foreground">
            Tender Track 360
          </span>
        </Link>

        <nav className="flex items-center gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                Welcome, {userName}
              </span>
              <Link href="/dashboard">
                <Button variant="outline" size="sm">
                  Dashboard
                </Button>
              </Link>
              <Logout />
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Button variant="ghost" asChild size="sm">
                <Link href="/login">Sign In</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/sign-up">Get Started</Link>
              </Button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
