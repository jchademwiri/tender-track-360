import { UserContext } from '@/types/home-page';
import { Header } from './Header';
import { HeroSection } from './HeroSection';
import { FeaturesSection } from './FeaturesSection';
import { FooterSection } from './FooterSection';
import { HomeAuthenticatedUserDashboard } from './HomeAuthenticatedUserDashboard';
import { BenefitsSection } from './BenefitsSection';
import { TestimonialsSection } from './TestimonialsSection';

interface HomePageProps {
  userContext: UserContext;
}

export function HomePage({ userContext }: HomePageProps) {
  return (
    <div className="min-h-screen">
      <Header
        isAuthenticated={userContext.isAuthenticated}
        userName={userContext.user?.name}
      />
      <main>
        <HeroSection
          isAuthenticated={userContext.isAuthenticated}
          userName={userContext.user?.name}
        />

        {userContext.isAuthenticated && userContext.user && (
          <HomeAuthenticatedUserDashboard
            user={{
              name: userContext.user.name,
              organizationName: userContext.user.organizationName,
            }}
            recentActivity={{
              activeTenders: 0, // Placeholder - will be populated in later tasks
              upcomingDeadlines: 0,
              recentDocuments: [],
            }}
          />
        )}

        <FeaturesSection />
        <BenefitsSection />
        <TestimonialsSection />
        <FooterSection />
      </main>
    </div>
  );
}
