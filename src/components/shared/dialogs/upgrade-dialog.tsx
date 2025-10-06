'use client';

import { useRouter } from 'next/navigation';
import { Crown, ArrowLeft, Zap } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface UpgradeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentCount: number;
  maxCount: number;
}

export function UpgradeDialog({
  open,
  onOpenChange,
  currentCount,
  maxCount,
}: UpgradeDialogProps) {
  const router = useRouter();

  const handleGoToDashboard = () => {
    onOpenChange(false);
    router.push('/dashboard');
  };

  const handleUpgradeToPro = () => {
    onOpenChange(false);
    // TODO: Implement upgrade flow
    // For now, just show a message
    alert(
      'Upgrade to Pro feature coming soon! Please contact support for now.'
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30">
            <Crown className="h-8 w-8 text-amber-600 dark:text-amber-400" />
          </div>
          <DialogTitle className="text-xl font-bold">
            Organization Limit Reached
          </DialogTitle>
          <DialogDescription className="text-center">
            You&apos;ve reached the maximum number of organizations for your
            current plan. Upgrade to Pro to create unlimited organizations and
            unlock more features.
          </DialogDescription>
        </DialogHeader>

        {/* Usage Badge */}
        <div className="flex items-center justify-center gap-2 -mt-2 mb-4">
          <Badge variant="secondary" className="font-mono">
            {currentCount}/{maxCount}
          </Badge>
          <span className="text-sm text-muted-foreground">
            organizations used
          </span>
        </div>

        <div className="space-y-4 pt-4">
          {/* Pro Features Preview */}
          <div className="rounded-lg border bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="font-medium text-blue-900 dark:text-blue-100">
                Pro Plan Benefits
              </span>
            </div>
            <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
              <li>• Unlimited organizations</li>
              <li>• Advanced tender management</li>
              <li>• Priority support</li>
              <li>• Advanced analytics</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2">
            <Button
              onClick={handleUpgradeToPro}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 cursor-pointer"
            >
              <Crown className="h-4 w-4 mr-2" />
              Upgrade to Pro
            </Button>

            <Button
              variant="outline"
              onClick={handleGoToDashboard}
              className="w-full cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
