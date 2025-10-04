import { HeroSectionProps } from '@/types/home-page';

export function HeroSection({ isAuthenticated, userName }: HeroSectionProps) {
  return (
    <section className="bg-gradient-to-b from-blue-50 to-white py-20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Streamline Your Tender Management Process
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          {isAuthenticated && userName
            ? `Welcome back, ${userName}! Continue managing your tenders efficiently.`
            : 'Comprehensive tender management platform that helps organizations track, manage, and win more tenders.'}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {/* Placeholder for CTA buttons - will be implemented in later tasks */}
          <div className="bg-blue-600 text-white px-8 py-3 rounded-lg">
            {isAuthenticated ? 'Go to Dashboard' : 'Get Started'}
          </div>
          {!isAuthenticated && (
            <div className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg">
              Learn More
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
