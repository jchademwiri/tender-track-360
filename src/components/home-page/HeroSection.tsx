import { HeroSectionProps } from '@/types/home-page';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function HeroSection({ isAuthenticated, userName }: HeroSectionProps) {
  return (
    <section className="bg-gradient-to-b from-secondary/50 to-background py-20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
          Streamline Your Tender Management Process
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
          {isAuthenticated && userName
            ? `Welcome back, ${userName}! Continue managing your tenders efficiently.`
            : 'Comprehensive tender management platform that helps organizations track, manage, and win more tenders.'}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {isAuthenticated ? (
            <Link href="/organization">
              <Button size="lg" className="px-8">
                Go to Dashboard
              </Button>
            </Link>
          ) : (
            <Link href="/sign-up">
              <Button size="lg" className="px-8">
                Get Started
              </Button>
            </Link>
          )}
          <Button
            size="lg"
            variant="outline"
            className="px-8"
            onClick={() => {
              const featuresSection = document.getElementById('features');
              if (featuresSection) {
                featuresSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            Learn More
          </Button>
        </div>
      </div>
    </section>
  );
}
