import { getMonthlySchedules } from "@/_action-server/schedule";
import StudyCalendar from "@/_components/schedule_calendar";

export default async function CalendarPage() {
  return <StudyCalendar />;
}
