'use client';

import { useRouter } from 'next/navigation';
import {
  Crown,
  ArrowLeft,
  CreditCard,
  TrendingUp,
  Users,
  Download,
  AlertCircle,
  Plus,
  Edit,
  Trash2,
  Receipt,
  Clock,
  Activity,
  Settings,
  Zap,
  Star,
  Shield,
  Lock,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';

// Types for billing data
interface Subscription {
  id: string;
  plan: string;
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  price: number;
  currency: string;
  interval: 'month' | 'year';
}

interface Usage {
  organizations: {
    current: number;
    limit: number;
  };
  tenders: {
    current: number;
    limit: number;
  };
  storage: {
    current: number; // in MB
    limit: number; // in MB
  };
}

interface PaymentMethod {
  id: string;
  type: 'card' | 'bank_account';
  last4: string;
  brand?: string;
  expiry_month?: number;
  expiry_year?: number;
  is_default: boolean;
}

interface Invoice {
  id: string;
  number: string;
  date: string;
  status: 'paid' | 'pending' | 'failed';
  amount: number;
  currency: string;
  description: string;
  download_url?: string;
}

export default function BillingPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [usage, setUsage] = useState<Usage | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [animateItems, setAnimateItems] = useState(false);

  useEffect(() => {
    // Trigger animations after a short delay
    const timer = setTimeout(() => setAnimateItems(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Simulate loading billing data
    const loadBillingData = async () => {
      try {
        setIsLoading(true);
        // TODO: Replace with actual API calls to Paystack
        // Documentation: https://paystack.com/docs/
        // Guides: https://paystack.com/docs/guides/accept_payments_on_your_react_app/
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Mock data - replace with actual API responses
        // Mock data removed for production readiness - waiting for API integration
        setSubscription(null);
        setUsage(null);
        setPaymentMethods([]);
        setInvoices([]);
      } catch (err) {
        setError('Failed to load billing information. Please try again.');
        console.error('Billing data load error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadBillingData();
  }, []);

  const handleGoBack = () => {
    router.back();
  };

  const handleUpgrade = () => {
    router.push('/billing/upgrade?plan=pro');
  };

  const handleManagePaymentMethod = () => {
    // TODO: Implement payment method management
    console.log('Manage payment method');
  };

  const handleDownloadInvoice = (invoiceId: string) => {
    // TODO: Implement invoice download
    console.log('Download invoice:', invoiceId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'trialing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'canceled':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
      case 'past_due':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: currency || 'ZAR',
    }).format(amount);
  };

  if (error) {
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
                  <CreditCard className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Billing & Subscription
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Manage your subscription and billing information
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Current Subscription Status */}
          <Card
            className={`transition-all duration-500 ${animateItems ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30">
                    <Crown className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">
                      Current Subscription
                    </CardTitle>
                    <CardDescription>
                      Your active subscription details and status
                    </CardDescription>
                  </div>
                </div>
                <Badge
                  className={getStatusColor(subscription?.status || 'active')}
                >
                  {subscription?.status || 'Loading...'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-64" />
                </div>
              ) : subscription ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Current Plan
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {subscription.plan}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Monthly Price
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {formatCurrency(
                        subscription.price,
                        subscription.currency
                      )}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Billing Period
                    </p>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {formatDate(subscription.current_period_start)} -{' '}
                      {formatDate(subscription.current_period_end)}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Next Billing
                    </p>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {formatDate(subscription.current_period_end)}
                    </p>
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>

          {/* Usage Tracking */}
          <Card
            className={`transition-all duration-500 delay-100 ${animateItems ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30">
                  <Activity className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <CardTitle className="text-xl">Usage Overview</CardTitle>
                  <CardDescription>
                    Track your current usage against plan limits
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-2 w-full" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-2 w-full" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-2 w-full" />
                  </div>
                </div>
              ) : usage ? (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">Organizations</span>
                      </div>
                      <Badge variant="secondary">
                        {usage.organizations.current}/
                        {usage.organizations.limit}
                      </Badge>
                    </div>
                    <Progress
                      value={
                        (usage.organizations.current /
                          usage.organizations.limit) *
                        100
                      }
                      className="h-2"
                    />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {usage.organizations.limit - usage.organizations.current}{' '}
                      organizations remaining
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">Tenders</span>
                      </div>
                      <Badge variant="secondary">
                        {usage.tenders.current}/{usage.tenders.limit}
                      </Badge>
                    </div>
                    <Progress
                      value={
                        (usage.tenders.current / usage.tenders.limit) * 100
                      }
                      className="h-2"
                    />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {usage.tenders.limit - usage.tenders.current} tenders
                      remaining
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Settings className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">Storage</span>
                      </div>
                      <Badge variant="secondary">
                        {Math.round(usage.storage.current)}MB/
                        {usage.storage.limit}MB
                      </Badge>
                    </div>
                    <Progress
                      value={
                        (usage.storage.current / usage.storage.limit) * 100
                      }
                      className="h-2"
                    />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {Math.round(usage.storage.limit - usage.storage.current)}
                      MB remaining
                    </p>
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>

          {/* Payment Method Management */}
          <Card
            className={`transition-all duration-500 delay-200 ${animateItems ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30">
                    <CreditCard className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Payment Methods</CardTitle>
                    <CardDescription>
                      Manage your payment methods and billing information
                    </CardDescription>
                  </div>
                </div>
                <Button
                  onClick={handleManagePaymentMethod}
                  variant="outline"
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Payment Method
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ) : paymentMethods.length > 0 ? (
                <div className="space-y-4">
                  {paymentMethods.map((paymentMethod) => (
                    <div
                      key={paymentMethod.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                          <CreditCard className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                        </div>
                        <div>
                          <p className="font-medium">
                            {paymentMethod.brand} ending in{' '}
                            {paymentMethod.last4}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Expires {paymentMethod.expiry_month}/
                            {paymentMethod.expiry_year}
                          </p>
                        </div>
                        {paymentMethod.is_default && (
                          <Badge variant="secondary">Default</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    No payment methods found
                  </p>
                  <Button onClick={handleManagePaymentMethod}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Payment Method
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Billing History & Plan Management */}
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Billing History */}
            <Card
              className={`transition-all duration-500 delay-300 ${animateItems ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30">
                    <Receipt className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Billing History</CardTitle>
                    <CardDescription>
                      View and download your invoices
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                  </div>
                ) : invoices.length > 0 ? (
                  <div className="space-y-4">
                    {invoices.map((invoice) => (
                      <div
                        key={invoice.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                            <Receipt className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                          </div>
                          <div>
                            <p className="font-medium">{invoice.number}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {formatDate(invoice.date)} • {invoice.description}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge
                            className={
                              invoice.status === 'paid'
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                : invoice.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                  : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                            }
                          >
                            {invoice.status}
                          </Badge>
                          <span className="font-medium">
                            {formatCurrency(invoice.amount, invoice.currency)}
                          </span>
                          {invoice.download_url && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDownloadInvoice(invoice.id)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">
                      No invoices found
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Plan Management */}
            <Card
              className={`transition-all duration-500 delay-400 ${animateItems ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30">
                    <Zap className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Plan Management</CardTitle>
                    <CardDescription>
                      Upgrade, downgrade, or modify your subscription
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <span className="font-medium text-blue-900 dark:text-blue-100">
                        Current Plan: Pro
                      </span>
                    </div>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      You&#x27;re on the Pro plan with access to all premium
                      features.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Button
                      onClick={handleUpgrade}
                      className="w-full"
                      size="lg"
                    >
                      <Crown className="h-5 w-5 mr-2" />
                      Upgrade to Enterprise
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full"
                      size="lg"
                      onClick={() => router.push('/billing/upgrade?plan=free')}
                    >
                      <ArrowLeft className="h-5 w-5 mr-2" />
                      Downgrade to Free
                    </Button>

                    <Button variant="outline" className="w-full" size="lg">
                      <Settings className="h-5 w-5 mr-2" />
                      Manage Subscription
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950/30"
                      size="lg"
                    >
                      <AlertCircle className="h-5 w-5 mr-2" />
                      Cancel Subscription
                    </Button>
                  </div>
                </div>

                {/* Trust Indicators */}
                <Separator />
                <div className="flex items-center justify-center gap-6 text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Shield className="h-3 w-3" />
                    <span>Secure</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Lock className="h-3 w-3" />
                    <span>Encrypted</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>Cancel Anytime</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
