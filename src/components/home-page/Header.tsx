'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import AuthAwareNav from './AuthAwareNav';

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={[
        'fixed top-0 left-0 right-0 z-50 transition-colors duration-300',
        'border-b',
        scrolled
          ? 'bg-background/60 supports-[backdrop-filter]:bg-background/40 backdrop-blur-md border-border/60'
          : 'bg-transparent border-border/20',
      ].join(' ')}
    >
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
