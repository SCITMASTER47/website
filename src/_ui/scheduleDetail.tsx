import { ScheduleDetailResponse } from "@/_types/schedule";

export default function ScheduleDetailView({
  schedule,
}: {
  schedule: ScheduleDetailResponse;
}) {
  return (
    <div className="space-y-2">
      {/* Schedule 정보 */}
      <div className="bg-white  p-2">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          📅 스케줄 정보
        </h2>
        {/* 스케쥴 id, 버전 정보  */}
        <div className="text-xs text-gray-500 mb-4">
          (ID: {schedule.id}, Version: {schedule.versionId})
        </div>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-500 mb-1">스케줄 요약</p>
            <p className="text-gray-900 font-medium">{schedule.summary}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">학습 기간</p>
            <p className="text-gray-700">
              {new Date(schedule.startDate).toLocaleDateString()} ~{" "}
              {new Date(schedule.endDate).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
      <hr className="text-gray-200" />
      {/* 자격증 정보 */}
      <div className="bg-white  p-2">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          🏆 자격증 정보
        </h2>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-500 mb-1">자격증명</p>
            <p className="text-gray-900 font-medium">
              {schedule.certificateInfo.title}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">설명</p>
            <p className="text-gray-700">
              {schedule.certificateInfo.description}
            </p>
          </div>
          {/* 과목 정보 */}

          <div>
            <p className="text-sm text-gray-500 mb-1">과목</p>
            <ul className="list-disc list-inside">
              {schedule.certificateInfo.subjects.map((subject) => (
                <li key={subject.id} className="text-gray-700">
                  {subject.name}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">시험 예정일</p>
            <p className="text-gray-700 font-medium">
              {new Date(schedule.endDate).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
      <hr className="text-gray-200" />
      {/* 책 정보 */}
      <div className="bg-white p-2">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          📚 교재 정보
        </h2>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-500 mb-1">교재명</p>
            <p className="text-gray-900 font-medium">
              {schedule.readBookDTO.title}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">출판사</p>
            <p className="text-gray-700">{schedule.readBookDTO.companyName}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
