import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { HomeIcon, ArrowLeftIcon, SearchIcon } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground px-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="text-center space-y-6">
            {/* 404 Visual Element */}
            <div className="relative">
              <div className="text-8xl font-bold text-muted-foreground/20 select-none">
                404
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <SearchIcon className="h-16 w-16 text-muted-foreground animate-pulse" />
              </div>
            </div>

            {/* Error Message */}
            <div className="space-y-2">
              <h1 className="text-2xl font-bold">Page Not Found</h1>
              <p className="text-muted-foreground">
                The page you&apos;re looking for doesn&apos;t exist or has been
                moved to a different location.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button asChild className="flex-1">
                <Link href="/">
                  <HomeIcon className="mr-2 h-4 w-4" />
                  Go Home
                </Link>
              </Button>
              <Button variant="outline" asChild className="flex-1">
                <Link href="#">
                  <ArrowLeftIcon className="mr-2 h-4 w-4" />
                  Go Back
                </Link>
              </Button>
            </div>

            {/* Additional Help */}
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Need help? Try checking the URL or{' '}
                <Link
                  href="/contact"
                  className="text-primary hover:underline font-medium"
                >
                  contact support
                </Link>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-xs text-muted-foreground">
          Error Code: 404 • Page Not Found
        </p>
      </div>
    </div>
  );
}
