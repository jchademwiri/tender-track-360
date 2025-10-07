import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function HeroSection() {
  return (
    <section className="bg-gradient-to-b from-secondary/50 to-background py-20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
          Streamline Your Tender Management Process
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
          Comprehensive tender management platform that helps organizations
          track, manage, and win more tenders.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild className="px-8">
            <Link href="/sign-up">Get Started</Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="px-8">
            <Link href="#features">Learn More</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
