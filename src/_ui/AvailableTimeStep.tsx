import { useCreateScheduleStore } from "@/_store/createSchedule";
import { Label } from "./label";

export default function AvailableTimeStep() {
  const { formData, handleChangeStudyHour } = useCreateScheduleStore();

  return (
    <div className="flex flex-col gap-2">
      <Label className="text-xl font-bold text-primary">
        하루 학습 가능 시간 (시간 단위)
      </Label>
      <div className="flex items-center gap-2">
        <input
          type="number"
          min={1}
          max={24}
          step={0.5}
          value={formData.targetHour}
          onChange={(e) => handleChangeStudyHour(Number(e.target.value))}
          className="w-24 px-2 py-1 border rounded-xl focus-visible:ring-primary focus-visible:ring-offset-2"
        />
        <span className="text-sm">시간</span>
      </div>
    </div>
  );
}
