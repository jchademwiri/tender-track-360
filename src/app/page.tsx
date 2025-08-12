import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  return (
    <section className="grid place-items-center min-h-screen text-center">
      <div>
        <h1 className="text-4xl font-bold">Tender Track 360</h1>
        <p className="mt-4 text-lg">Welcome to Tender Track 360!</p>
        <div className="mt-8">
          <Link href="/dashboard">
            <Button size={'lg'} className="cursor-pointer">
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
