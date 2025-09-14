import { Checkbox } from "./checkbox";
import { Label } from "./label";
import { useCreateScheduleStore } from "@/_store/createSchedule";

export default function AvailableDateStep() {
  const { formData, weekdays, handleClickWeekDay } = useCreateScheduleStore();

  return (
    <div className="flex flex-col gap-2">
      <Label className="text-xl font-bold text-primary">학습 가능한 요일</Label>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {weekdays.map((day) => (
          <div key={day.id} className="flex items-center space-x-2">
            <Checkbox
              id={day.id}
              checked={formData.availableDays.includes(day.value)}
              onCheckedChange={(checked) =>
                handleClickWeekDay(day.value, checked as boolean)
              }
            />
            <Label htmlFor={day.id} className="text-md font-bold">
              {day.label}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
}
