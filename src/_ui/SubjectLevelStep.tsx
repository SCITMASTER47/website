"use client";
import { useCreateScheduleStore } from "@/_store/createSchedule";
import { useMemo } from "react";

export default function SubjectLevelStep() {
  const {
    formData,

    handleSubjectLevelChange,
    setFocusNotes,
    onSubmit,
  } = useCreateScheduleStore();

  return (
    <div className="flex flex-col w-full justify-between">
      {/* <CardContent className="flex-1  overflow-y-auto space-y-6 pb-20">
        <div className="space-y-10 ">
          {subjects.map((subject) => (
            <div
              key={subject.id}
              className="space-y-4 border-b-2 border-gray-50 pb-2"
            >
              <Label className="text-md font-bold  block">{subject.name}</Label>
              <div className="flex flex-row justify-around gap-8">
                {[
                  { value: "고급", label: "상" },
                  { value: "중급", label: "중" },
                  { value: "초급", label: "하" },
                ].map((level) => (
                  <label
                    key={level.value}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Checkbox
                      checked={
                        formData.proficiency[subject.name] === level.value
                      }
                      onCheckedChange={() =>
                        handleSubjectLevelChange(
                          subject.name,
                          level.value as "초급" | "중급" | "고급"
                        )
                      }
                    />
                    <span className="text-xs">{level.label}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="space-y-2">
          <Label htmlFor="notes">추가 요청사항 (선택사항)</Label>
          <Textarea
            id="notes"
            placeholder="특별히 집중하고 싶은 부분이나 요청사항이 있다면 적어주세요"
            value={formData.userPrompt}
            onChange={(e) => setFocusNotes(e.target.value)}
          />
        </div>
      </CardContent>
      <Button
        disabled={!isNextStepAvailable}
        className="w-full"
        onClick={onSubmit}
      >
        AI 학습 플랜 생성하기
      </Button> */}
    </div>
  );
}
