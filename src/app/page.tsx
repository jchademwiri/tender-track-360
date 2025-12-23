import { Header } from '@/components/home-page/Header';
import { HeroSection } from '@/components/home-page/HeroSection';
import { FeaturesSection } from '@/components/home-page/FeaturesSection';
import { BenefitsSection } from '@/components/home-page/BenefitsSection';
import { PricingSection } from '@/components/home-page/PricingSection';
import { TestimonialsSection } from '@/components/home-page/TestimonialsSection';
import { FooterSection } from '@/components/home-page/FooterSection';
import { TrustedBy } from '@/components/home-page/TrustedBy';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <TrustedBy />
        <FeaturesSection />
        <BenefitsSection />
        <PricingSection />
        <TestimonialsSection />
        <FooterSection />
      </main>
    </div>
  );
}
