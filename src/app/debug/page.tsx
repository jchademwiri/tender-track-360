import { AuthDebug } from '@/components/debug/auth-debug';
import { SignupTest } from '@/components/debug/signup-test';
import { EmailTest } from '@/components/debug/email-test';

export default function DebugPage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Auth Debug Page</h1>

      <AuthDebug />

      <SignupTest />

      <EmailTest />
    </div>
  );
}
