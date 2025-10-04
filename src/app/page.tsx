import { HomePage } from '@/components/home-page';
import { UserContext } from '@/types/home-page';

export default function Home() {
  // Placeholder user context - will be populated with real authentication in later tasks
  const userContext: UserContext = {
    isAuthenticated: false, // This will be determined by actual auth state in later tasks
    user: undefined,
  };

  return <HomePage userContext={userContext} />;
}
