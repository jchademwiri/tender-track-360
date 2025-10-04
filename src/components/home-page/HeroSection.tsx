import { HeroSectionProps } from '@/types/home-page';

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
          {/* Placeholder for CTA buttons - will be implemented in later tasks */}
          <div className="bg-primary text-primary-foreground px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors">
            {isAuthenticated ? 'Go to Dashboard' : 'Get Started'}
          </div>
          {!isAuthenticated && (
            <div className="border border-border text-foreground px-8 py-3 rounded-lg hover:bg-secondary/50 transition-colors">
              Learn More
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
