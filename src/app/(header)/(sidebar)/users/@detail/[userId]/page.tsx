import { getUserSchedules } from "@/_action-server/schedule";
import UserScheduleView from "@/_components/users/UserScheduleView";

export default async function UserDetailPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const userSchedules = await getUserSchedules(userId);

  return <UserScheduleView schedules={userSchedules} isLoading={false} />;
}
