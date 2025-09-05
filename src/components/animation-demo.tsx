'use client';

import { OrganizationCard } from './organization-card';
import { CreateOrganizationCard } from './create-organization-card';
import { OrganizationCardSkeleton } from './organization-card-skeleton';
import { OrganizationGridSkeleton } from './organization-grid-skeleton';
import { Organization } from '@/db/schema';
import { useState } from 'react';
import { Button } from './ui/button';

const mockOrganization: Organization = {
  id: '1',
  name: 'Demo Organization',
  slug: 'demo-org',
  logo: null,
  createdAt: new Date('2024-01-01'),
  metadata: null,
};

export function AnimationDemo() {
  const [showSkeletons, setShowSkeletons] = useState(false);

  return (
    <div className="p-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Animation Demo</h1>
        <p className="text-muted-foreground">
          Hover over the cards to see the enhanced animations and
          micro-interactions
        </p>
        <Button
          onClick={() => setShowSkeletons(!showSkeletons)}
          variant="outline"
        >
          {showSkeletons ? 'Show Cards' : 'Show Skeletons'}
        </Button>
      </div>

      {showSkeletons ? (
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Loading Skeletons</h2>
            <OrganizationGridSkeleton count={3} />
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Organization Cards</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <OrganizationCard
                organization={mockOrganization}
                memberCount={5}
                userRole="admin"
                isActive={true}
              />
              <OrganizationCard
                organization={{
                  ...mockOrganization,
                  id: '2',
                  name: 'Another Organization',
                  slug: 'another-org',
                }}
                memberCount={12}
                userRole="member"
                isActive={false}
              />
              <CreateOrganizationCard />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Animation Features</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Hover Effects</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Scale and lift on hover</li>
                  <li>• Enhanced shadow with primary color</li>
                  <li>• Gradient overlay animation</li>
                  <li>• Avatar scale animation</li>
                </ul>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Micro-interactions</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Button hover animations</li>
                  <li>• Icon rotation effects</li>
                  <li>• Smooth transitions</li>
                  <li>• Loading skeleton animations</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
