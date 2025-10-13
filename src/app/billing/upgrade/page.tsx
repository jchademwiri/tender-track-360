'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import {
  Crown,
  ArrowLeft,
  Check,
  Star,
  Users,
  Shield,
  Clock,
  Building2,
  AlertCircle,
  CreditCard,
  Lock,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Enhanced TypeScript interfaces
interface PricingTier {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  popular?: boolean;
  enterprise?: boolean;
  ctaText: string;
}

interface Testimonial {
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
}

export default function UpgradePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planParam = searchParams.get('plan');

  const [isUpgrading, setIsUpgrading] = useState(false);
  const [isContactingSales, setIsContactingSales] = useState(false);
  const [showTestimonials, setShowTestimonials] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Animation state for staggered animations
  const [animateItems, setAnimateItems] = useState(false);

  useEffect(() => {
    // Trigger animations after a short delay
    const timer = setTimeout(() => setAnimateItems(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Validate plan parameter
  useEffect(() => {
    if (planParam && !['free', 'pro', 'enterprise'].includes(planParam)) {
      setError('Invalid plan parameter. Please select a valid plan.');
    } else {
      setError(null);
      setSelectedPlan(planParam);
    }
  }, [planParam]);

  const pricingTiers: PricingTier[] = [
    {
      id: 'free',
      name: 'Free',
      price: '$0',
      period: '/month',
      description: 'Perfect for getting started',
      features: [
        '1 organization',
        'Basic tender management',
        '5 tenders per month',
        '100MB storage',
        'Community support',
        'Basic reporting',
      ],
      ctaText: 'Get Started Free',
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '$29',
      period: '/month',
      description: 'Perfect for growing teams',
      features: [
        '5 organizations',
        'Advanced tender management',
        'Priority support',
        'Advanced analytics',
        'Custom workflows',
        'API access',
        'Team collaboration tools',
        'Export capabilities',
      ],
      popular: true,
      ctaText: 'Start Pro Trial',
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 'Custom',
      period: 'pricing',
      description: 'For large organizations',
      features: [
        'Everything in Pro',
        'Dedicated account manager',
        'SSO & advanced security',
        'Custom integrations',
        'SLA guarantee',
        'Phone support',
        'Advanced compliance',
        'Custom training',
      ],
      enterprise: true,
      ctaText: 'Contact Sales',
    },
  ];

  const testimonials: Testimonial[] = [
    {
      name: 'Sarah Johnson',
      role: 'Procurement Director',
      company: 'TechCorp',
      content:
        "The upgrade to Pro has transformed our tender management process. We've seen a 40% increase in efficiency.",
      rating: 5,
    },
    {
      name: 'Michael Chen',
      role: 'Operations Manager',
      company: 'Global Industries',
      content:
        'The advanced analytics and unlimited organizations feature is exactly what our growing team needed.',
      rating: 5,
    },
    {
      name: 'Emily Rodriguez',
      role: 'CEO',
      company: 'StartupXYZ',
      content:
        'The API access and custom workflows have allowed us to integrate seamlessly with our existing systems.',
      rating: 5,
    },
  ];

  const getSelectedTier = () => {
    if (!selectedPlan) return pricingTiers[0]; // Default to Pro
    return (
      pricingTiers.find((tier) => tier.id === selectedPlan) || pricingTiers[0]
    );
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleUpgrade = async (planId: string) => {
    const tier = pricingTiers.find((t) => t.id === planId);
    if (!tier) return;

    if (tier.enterprise) {
      await handleContactSales();
    } else {
      await handleUpgradeToPro();
    }
  };

  const handleUpgradeToPro = async () => {
    setIsUpgrading(true);
    try {
      // TODO: Implement actual upgrade flow with payment provider (Stripe, etc.)
      // For now, simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Show success message and redirect to dashboard
      alert('Upgrade successful! Welcome to the Pro plan.');
      router.push('/dashboard');
    } catch (error) {
      console.error('Upgrade failed:', error);
      setError('Upgrade failed. Please try again or contact support.');
    } finally {
      setIsUpgrading(false);
    }
  };

  const handleContactSales = async () => {
    setIsContactingSales(true);
    try {
      // TODO: Implement contact sales flow
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Open email client or redirect to contact form
      window.location.href =
        'mailto:sales@tendertrack360.com?subject=Enterprise%20Plan%20Inquiry&body=Hi%2C%0A%0AI%27m%20interested%20in%20the%20Enterprise%20plan.%20Please%20contact%20me%20to%20discuss%20pricing%20and%20features.%0A%0AThank%20you%21';
    } catch (error) {
      console.error('Contact sales failed:', error);
      setError(
        'Failed to contact sales. Please email us directly at sales@tendertrack360.com'
      );
    } finally {
      setIsContactingSales(false);
    }
  };

  if (error && planParam) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <div className="mt-4 text-center">
            <Button onClick={handleGoBack} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                onClick={handleGoBack}
                variant="ghost"
                size="sm"
                className="cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-amber-100 via-orange-100 to-yellow-100 dark:from-amber-900/30 dark:via-orange-900/30 dark:to-yellow-900/30">
                  <Crown className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Upgrade Your Plan
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Choose the perfect plan for your needs
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div
            className={`text-center space-y-6 transition-all duration-500 ${animateItems ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
          >
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-amber-100 via-orange-100 to-yellow-100 dark:from-amber-900/30 dark:via-orange-900/30 dark:to-yellow-900/30">
              <Crown className="h-12 w-12 text-amber-600 dark:text-amber-400" />
            </div>

            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Unlock Your Team&#x27;s Full Potential
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Join thousands of organizations already using our platform to
                streamline their tender management process.
              </p>
            </div>
          </div>

          {/* Pricing Tiers */}
          <div
            className={`space-y-8 pt-12 transition-all duration-500 delay-200 ${animateItems ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
          >
            <div className="grid gap-8 lg:grid-cols-3">
              {pricingTiers.map((tier, index) => (
                <div
                  key={tier.id}
                  className={`relative rounded-2xl border-2 p-8 transition-all duration-500 hover:shadow-xl ${
                    tier.popular
                      ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 scale-105'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  } ${animateItems ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
                  style={{ transitionDelay: `${300 + index * 100}ms` }}
                >
                  {tier.popular && (
                    <Badge className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-1">
                      <Star className="h-3 w-3 mr-1" />
                      Most Popular
                    </Badge>
                  )}

                  <div className="space-y-6">
                    <div className="text-center space-y-4">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                          {tier.name}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">
                          {tier.description}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-baseline justify-center gap-2">
                          <span className="text-4xl font-bold text-gray-900 dark:text-white">
                            {tier.price}
                          </span>
                          <span className="text-gray-600 dark:text-gray-300">
                            {tier.period}
                          </span>
                        </div>
                        {tier.id === 'pro' && (
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            14-day free trial • No credit card required
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      {tier.features.map((feature, featureIndex) => (
                        <div
                          key={featureIndex}
                          className="flex items-start gap-3"
                        >
                          <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700 dark:text-gray-300">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>

                    <Button
                      onClick={() => handleUpgrade(tier.id)}
                      disabled={isUpgrading || isContactingSales}
                      className={`w-full h-12 text-base font-medium cursor-pointer ${
                        tier.popular
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
                          : tier.enterprise
                            ? 'bg-gray-900 hover:bg-gray-800'
                            : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                      }`}
                    >
                      {isUpgrading && selectedPlan === tier.id ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                          Processing...
                        </>
                      ) : isContactingSales && selectedPlan === tier.id ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                          Connecting...
                        </>
                      ) : (
                        <>
                          {tier.enterprise ? (
                            <Building2 className="h-5 w-5 mr-2" />
                          ) : (
                            <CreditCard className="h-5 w-5 mr-2" />
                          )}
                          {tier.ctaText}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Social Proof Section */}
          <div
            className={`space-y-8 pt-16 transition-all duration-500 delay-500 ${animateItems ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
          >
            <div className="text-center">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setShowTestimonials(!showTestimonials)}
                className="cursor-pointer"
              >
                <Users className="h-5 w-5 mr-2" />
                {showTestimonials ? 'Hide' : 'Show'} Success Stories
              </Button>
            </div>

            {showTestimonials && (
              <div className="grid gap-6 md:grid-cols-3 animate-in slide-in-from-bottom-4 duration-500">
                {testimonials.map((testimonial, index) => (
                  <div
                    key={index}
                    className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 mb-4 italic">
                      "{testimonial.content}"
                    </p>
                    <div className="text-sm">
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {testimonial.name}
                      </span>
                      <p className="text-gray-500 dark:text-gray-400">
                        {testimonial.role} at {testimonial.company}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Trust Indicators */}
          <div
            className={`flex flex-wrap items-center justify-center gap-8 pt-16 text-sm text-gray-500 dark:text-gray-400 transition-all duration-500 delay-700 ${animateItems ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
          >
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>Secure Payment</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              <span>SSL Encrypted</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Cancel Anytime</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>24/7 Support</span>
            </div>
          </div>

          {/* FAQ Section */}
          <div
            className={`space-y-8 pt-16 transition-all duration-500 delay-900 ${animateItems ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
          >
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Frequently Asked Questions
              </h3>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Can I change plans anytime?
                </h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Yes, you can upgrade or downgrade your plan at any time.
                  Changes take effect immediately.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Is there a free trial?
                </h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Yes! The Pro plan comes with a 14-day free trial. No credit
                  card required to start.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  What payment methods do you accept?
                </h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  We accept all major credit cards, PayPal, and bank transfers
                  for Enterprise customers.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Do you offer refunds?
                </h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Yes, we offer a 30-day money-back guarantee if you&#x27;re not
                  satisfied with your upgrade.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
