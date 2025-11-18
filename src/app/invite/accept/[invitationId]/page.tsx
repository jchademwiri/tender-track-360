import { db } from '@/db';
import { invitation } from '@/db/schema';
import { eq } from 'drizzle-orm';
import AcceptInvitationClient from '@/components/invite/AcceptInvitationClient';

type Props = {
  params: {
    invitationId: string;
  };
};

export default async function InviteAcceptPage({ params }: Props) {
  const { invitationId } = params;

  const invite = await db.query.invitation.findFirst({
    where: eq(invitation.id, invitationId),
  });

  if (!invite) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold">Invitation not found</h1>
        <p className="mt-2 text-muted-foreground">
          This invitation may have expired or been cancelled.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        {/* Server renders invite details and shows client component for actions */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold">You're invited</h1>
          <p className="text-muted-foreground mt-2">
            You were invited to join the organization{' '}
            <strong>{invite.organizationId}</strong> as{' '}
            <strong>{invite.role}</strong>.
          </p>
        </div>
        <AcceptInvitationClient
          invitationId={invitationId}
          inviteEmail={invite.email}
        />
      </div>
    </div>
  );
}
