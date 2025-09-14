"use client";

import AvailableDateStep from "./AvailableDateStep";
import AvailableTimeStep from "./AvailableTimeStep";
import { useMemo } from "react";
import CardContent from "@mui/material/CardContent";
import { useCreateScheduleStore } from "@/_store/createSchedule";
import { Button } from "./button";

export default function SelectDataAndTime() {
  const { formData, handleClickDateTimeNext } = useCreateScheduleStore();

  const isNextStepAvailable = useMemo(() => {
    return formData.availableDays.length > 0 && formData.targetHour > 0;
  }, [formData]);

  return (
    <CardContent className="flex-1 w-full h-full ">
      <div className="flex flex-col justify-between w-full h-full">
        <div className="flex flex-col gap-10">
          <AvailableDateStep />
          <AvailableTimeStep />
        </div>
        <div>
          <Button
            disabled={!isNextStepAvailable}
            className="w-full"
            onClick={handleClickDateTimeNext}
          >
            다음
          </Button>
        </div>
      </div>
    </CardContent>
  );
}
