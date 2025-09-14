"use client";

import { useEffect, useState } from "react";

export default function Timer() {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setCurrentTime(new Date());

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // if (!isClient || !currentTime) {
  //   return (
  //     <div className="flex w-full flex-col ">
  //       <div className="text-2xl font-bold uppercase ">
  //         {currentTime.toLocaleDateString("ko-KR", {
  //           month: "long",
  //           day: "numeric",
  //           weekday: "long",

  //           timeZone: "Asia/Seoul",
  //         })}
  //       </div>
  //       <div className="text font-bold uppercase">
  //         {currentTime.toLocaleTimeString("ko-KR", {
  //           hour: "2-digit",
  //           minute: "2-digit",
  //           second: "2-digit",
  //           timeZone: "Asia/Seoul",
  //         })}
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="flex w-full flex-col ">
      <div className="text-2xl font-bold uppercase ">
        {currentTime.toLocaleDateString("ko-KR", {
          month: "long",
          day: "numeric",
          weekday: "long",

          timeZone: "Asia/Seoul",
        })}
      </div>
      <div className="text font-bold uppercase">
        {currentTime.toLocaleTimeString("ko-KR", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZone: "Asia/Seoul",
        })}
      </div>
    </div>
  );
}
