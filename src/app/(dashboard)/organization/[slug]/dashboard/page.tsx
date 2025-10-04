type Params = Promise<{ slug: string }>;

export default async function Dashboard({
  params: _params,
}: {
  params: Params;
}) {
  // Dashboard intentionally left empty for now for all roles
  return null;
}
