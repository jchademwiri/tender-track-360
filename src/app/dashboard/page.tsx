import Logout from '@/components/logout';

export default function Dashboard() {
  return (
    <section className="grid place-items-center min-h-screen text-center">
      <div>
        <h1 className="text-4xl font-bold">Tender Track 360</h1>
        <p className="mt-4 text-lg">Welcome to Tender Track 360!</p>
        <div className="mt-8">
          <Logout />
        </div>
      </div>
    </section>
  );
}
