// dynamic route page

export default async function ScheduleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <div>Schedule Detail Page: {id}</div>;
}
