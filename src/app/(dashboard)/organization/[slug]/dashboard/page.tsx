type Params = Promise<{ slug: string }>;

export default async function Dashboard({ params }: { params: Params }) {
  // Extract slug from params for future use
  const { slug } = await params;

  // Dashboard intentionally left empty for now for all roles
  // TODO: Implement dashboard content based on organization slug
  console.log('Dashboard for organization:', slug);
  return null;
}
