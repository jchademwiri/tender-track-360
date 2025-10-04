'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { InviteMemberModal } from './shared/modals';

export function InviteMemberModalDemo() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="p-8">
      <Button onClick={() => setIsOpen(true)}>Open Invite Member Modal</Button>

      <InviteMemberModal
        organizationId="demo-org-123"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSuccess={() => {
          console.log('Invitation sent successfully!');
          setIsOpen(false);
        }}
      />
    </div>
  );
}
