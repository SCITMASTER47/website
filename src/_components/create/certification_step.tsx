"use client";

import { useCreateScheduleStore } from "@/_store/createSchedule";
import { Certification } from "@/_types/schedule";
import CertifyLogo from "../../_ui/logo/logo";
import { Card, CardContent } from "../../_ui/card";
import { Badge } from "../../_ui/badge";
import { useRouter } from "next/navigation";

export interface CertificationStepProps {
  certifications: Certification[];
}
export default function CertificationStep({
  certifications,
}: CertificationStepProps) {
  const { formData, handleSelectCert, loading } = useCreateScheduleStore();
  const router = useRouter();
  // 비슷한 톤의 색상 팔레트 - 20가지 파스텔 색상으로 순환
  const colorPalette = [
    "bg-blue-50",
    "bg-blue-100",
    "bg-blue-200",
    "bg-purple-50",
    "bg-purple-100",
    "bg-purple-200",
    "bg-pink-50",
    "bg-pink-100",
    "bg-pink-200",
    "bg-indigo-50",
    "bg-indigo-100",
    "bg-indigo-200",
    "bg-violet-50",
    "bg-violet-100",
    "bg-violet-200",
    "bg-cyan-50",
    "bg-cyan-100",
    "bg-cyan-200",
    "bg-teal-50",
    "bg-teal-100",
  ];

  // cert.id를 기반으로 색상 순환 (0-19 범위)
  const getColorByIndex = (id: string | number) => {
    const numId = typeof id === "string" ? parseInt(id, 10) : id;
    const index = numId % colorPalette.length;
    return colorPalette[index];
  };

  const handleClickSelectCert = (certification: Certification) => {
    const nextUrl = handleSelectCert(certification);
    router.replace(nextUrl);
  };
  return loading ? (
    <div className="flex flex-col grow h-full justify-center items-center">
      <CertifyLogo loading={loading} />
      <p className="text-xs text-gray-500 font-bold">
        자격증 정보를 가져오는중
      </p>
    </div>
  ) : (
    <CardContent className="flex-1 p-0">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 ">
        {certifications.map((cert: Certification) => (
          <div key={cert.id} className="flex flex-col p-1">
            <Card
              key={cert.id}
              className={`h-56 cursor-pointer transition-all shadow-sm hover:scale-95 ${
                formData.licenseId === cert.id
                  ? "ring-2 ring-primary ring-offset-2"
                  : ""
              }`}
              onClick={() => handleClickSelectCert(cert)}
            >
              {/* 랜덤 배경색 적용 - 비슷한 톤의 파스텔 색상들 */}
              <div
                className={`w-full h-20  rounded-t-xl overflow-hidden ${getColorByIndex(
                  cert.id
                )} flex items-center justify-center`}
              >
                {cert.imgUrl ? (
                  <img
                    src={cert.imgUrl}
                    alt={cert.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="text-gray-700 text-2xl font-bold">
                    {cert.title.charAt(0)}
                  </div>
                )}
              </div>
              <CardContent className="p-4 border-t-2 border-gray-100">
                <h3 className="text-2xl font-semibold mb-2">{cert.title}</h3>
                <div className="flex flex-wrap gap-1">
                  {cert.subjects.map((subject) => (
                    <Badge
                      key={subject.id}
                      variant="secondary"
                      className="text-xs "
                    >
                      {subject.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </CardContent>
  );
}
