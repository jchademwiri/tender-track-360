'use client';

import { useState } from 'react';
import { CreateorganizationForm } from '@/components/forms';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui';

interface CreateOrgProps {
  organizations: any[]; // Replace 'any' with your organization type
}

export default function CreateOrg({ organizations }: CreateOrgProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isUpgradeDialogOpen, setIsUpgradeDialogOpen] = useState(false);

  return (
    <div>
      <div
        className="max-w-md mx-auto"
        role="main"
        aria-labelledby="empty-state-heading"
      >
        <div className="text-center space-y-6">
          <div className="space-y-2">
            <h2 id="empty-state-heading" className="text-2xl font-semibold">
              Create Your First Organization
            </h2>
            <p className="text-muted-foreground">
              Get started by creating an organization to manage your projects
              and team.
            </p>
          </div>

          <Button
            size="lg"
            className="w-full"
            onClick={() => {
              if (organizations.length >= 2) {
                setIsCreateDialogOpen(false);
                setTimeout(() => setIsUpgradeDialogOpen(true), 100);
                return;
              }
              setIsCreateDialogOpen(true);
            }}
            aria-describedby="empty-state-heading"
          >
            Create Organization
          </Button>

          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogContent
              title="Create Organization"
              aria-labelledby="create-dialog-title"
              aria-describedby="create-dialog-description"
            >
              <DialogHeader>
                <DialogTitle id="create-dialog-title">
                  Create Organization
                </DialogTitle>
                <DialogDescription id="create-dialog-description">
                  Please fill in the details to create a new organization.
                </DialogDescription>
              </DialogHeader>
              <CreateorganizationForm
                currentOrganizationCount={organizations.length}
              />
            </DialogContent>
          </Dialog>

          {/* Upgrade Dialog - if you need it */}
          <Dialog
            open={isUpgradeDialogOpen}
            onOpenChange={setIsUpgradeDialogOpen}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upgrade Required</DialogTitle>
                <DialogDescription>
                  You've reached the maximum number of organizations for your
                  plan.
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
