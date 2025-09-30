"use client";

import { useCreateScheduleStore } from "@/_store/createSchedule";
import { Certification } from "@/_types/schedule";
import CertifyLogo from "../../_ui/logo/logo";
import { Card, CardContent, CardHeader, CardTitle } from "../../_ui/card";
import { Badge } from "../../_ui/badge";
import { Button } from "../../_ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";
import { getAllCertificates } from "@/_action-server/schedule";
import {
  AwardIcon,
  BookOpenIcon,
  CheckCircleIcon,
  GraduationCapIcon,
  StarIcon,
  TrendingUpIcon,
} from "lucide-react";

export default function CertificationStep() {
  const { handleSelectCert, loading } = useCreateScheduleStore();
  const router = useRouter();
  const [selectedCert, setSelectedCert] = useState<Certification | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCertifications = async () => {
      try {
        const data = await getAllCertificates();
        setCertifications(data);
      } catch (error) {
        console.error("Failed to fetch certifications:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCertifications();
  }, []);

  // 현대적이고 부드러운 그라데이션 색상 팔레트
  const gradientPalette = [
    "from-blue-400 to-blue-600",
    "from-purple-400 to-purple-600",
    "from-pink-400 to-pink-600",
    "from-indigo-400 to-indigo-600",
    "from-violet-400 to-violet-600",
    "from-cyan-400 to-cyan-600",
    "from-teal-400 to-teal-600",
    "from-emerald-400 to-emerald-600",
    "from-green-400 to-green-600",
    "from-lime-400 to-lime-600",
    "from-yellow-400 to-yellow-600",
    "from-orange-400 to-orange-600",
    "from-red-400 to-red-600",
    "from-rose-400 to-rose-600",
    "from-fuchsia-400 to-fuchsia-600",
  ];

  // cert.id를 기반으로 그라데이션 색상 선택
  const getGradientByIndex = (id: string | number) => {
    const numId = typeof id === "string" ? parseInt(id, 10) : id;
    const index = numId % gradientPalette.length;
    return gradientPalette[index];
  };

  // 자격증 레벨/난이도에 따른 아이콘 선택
  const getCertIcon = (title: string) => {
    if (title.includes("기사") || title.includes("Engineer"))
      return GraduationCapIcon;
    if (title.includes("산업기사") || title.includes("Assistant"))
      return BookOpenIcon;
    if (title.includes("기능사") || title.includes("Technician"))
      return AwardIcon;
    if (title.includes("마스터") || title.includes("Master")) return StarIcon;
    return TrendingUpIcon; // 기본 아이콘
  };

  // 자격증 레벨 텍스트 반환
  const getCertLevel = (title: string) => {
    if (title.includes("기사") || title.includes("Engineer")) return "고급";
    if (title.includes("산업기사") || title.includes("Assistant"))
      return "중급";
    if (title.includes("기능사") || title.includes("Technician")) return "초급";
    if (title.includes("마스터") || title.includes("Master")) return "전문가";
    return "일반";
  };

  // 자격증 레벨에 따른 색상 반환
  const getCertLevelColor = (title: string) => {
    if (title.includes("기사") || title.includes("Engineer"))
      return "bg-red-100 text-red-700";
    if (title.includes("산업기사") || title.includes("Assistant"))
      return "bg-yellow-100 text-yellow-700";
    if (title.includes("기능사") || title.includes("Technician"))
      return "bg-green-100 text-green-700";
    if (title.includes("마스터") || title.includes("Master"))
      return "bg-purple-100 text-purple-700";
    return "bg-blue-100 text-blue-700";
  };

  const handleClickSelectCert = async (certification: Certification) => {
    setIsSelecting(true);
    setSelectedCert(certification);

    try {
      const nextUrl = handleSelectCert(certification);
      router.replace(nextUrl);
    } catch (error) {
      console.error("Failed to select certification:", error);
      setSelectedCert(null);
    } finally {
      setIsSelecting(false);
    }
  };
  if (isLoading) {
    return (
      <div className="flex flex-col grow h-full justify-center items-center">
        <CertifyLogo loading={true} />
        <p className="text-sm text-muted-foreground font-medium mt-4">
          자격증 정보를 불러오는 중...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full space-y-6">
      {loading ? (
        <div className="flex flex-col grow h-full justify-center items-center">
          <CertifyLogo loading={loading} />
          <p className="text-sm text-muted-foreground font-medium mt-4">
            자격증 정보를 가져오는 중...
          </p>
        </div>
      ) : (
        <>
          {/* 헤더 */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <GraduationCapIcon className="h-5 w-5 text-primary" />
                <CardTitle>자격증 선택</CardTitle>
                <div className="ml-auto flex items-center gap-2">
                  <Badge variant="secondary">
                    {certifications.length}개 자격증
                  </Badge>
                  {selectedCert && (
                    <Badge variant="default" className="bg-green-600">
                      선택 완료
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                학습하고자 하는 자격증을 선택하세요. 각 자격증은 전문적으로
                구성된 학습 계획을 제공합니다.
              </p>
            </CardContent>
          </Card>

          {/* 자격증 목록 */}
          <div className="flex-1 overflow-hidden">
            <div className="h-full overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-2">
                {certifications.map((cert: Certification) => {
                  const IconComponent = getCertIcon(cert.title);
                  const gradientClass = getGradientByIndex(cert.id);
                  const isSelected = selectedCert?.id === cert.id;

                  return (
                    <Card
                      key={cert.id}
                      className={`group cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] ${
                        isSelected
                          ? "ring-2 ring-primary shadow-lg"
                          : "hover:shadow-lg"
                      }`}
                      onClick={() => handleClickSelectCert(cert)}
                    >
                      <div className="relative overflow-hidden">
                        {/* 헤더 그라데이션 영역 */}
                        <div
                          className={`w-full h-24 bg-gradient-to-br ${gradientClass} flex items-center justify-center relative`}
                        >
                          {/* 배경 패턴 */}
                          <div className="absolute inset-0 bg-black/5"></div>

                          {/* {cert.imgUrl ? (
                            <div className="relative w-16 h-16 rounded-full overflow-hidden bg-white/20 backdrop-blur-sm">
                              <Image
                                src={cert.imgUrl}
                                alt={cert.title}
                                fill
                                className="object-cover"
                                sizes="64px"
                                onError={() => {
                                  console.log(
                                    "Certification image failed to load:",
                                    cert.imgUrl
                                  );
                                }}
                              />
                            </div>
                          ) : ( */}
                          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm">
                            <IconComponent className="h-8 w-8 text-white" />
                          </div>

                          {/* 레벨 배지 */}
                          <div className="absolute top-2 left-2">
                            <Badge
                              className={`text-xs font-semibold ${getCertLevelColor(
                                cert.title
                              )} bg-white/90 backdrop-blur-sm`}
                            >
                              {getCertLevel(cert.title)}
                            </Badge>
                          </div>

                          {/* 선택된 상태 표시 */}
                          {isSelected && (
                            <div className="absolute top-2 right-2">
                              <CheckCircleIcon className="h-6 w-6 text-white drop-shadow-lg" />
                            </div>
                          )}
                        </div>

                        {/* 카드 내용 */}
                        <CardContent className="p-4 space-y-4">
                          <div className="space-y-2">
                            <div className="flex items-start justify-between gap-2">
                              <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors flex-1">
                                {cert.title}
                              </h3>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <StarIcon className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                <span>인기</span>
                              </div>
                            </div>

                            {cert.description && (
                              <p
                                className="text-sm text-muted-foreground overflow-hidden"
                                style={{
                                  display: "-webkit-box",
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: "vertical",
                                }}
                              >
                                {cert.description}
                              </p>
                            )}
                          </div>

                          {/* 과목 배지들 */}
                          <div className="space-y-2">
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <BookOpenIcon className="h-3 w-3" />
                              <span>시험 과목 ({cert.subjects.length}개)</span>
                            </div>
                            <div className="flex flex-wrap gap-1 max-h-16 overflow-hidden">
                              {cert.subjects.map((subject, index) => (
                                <Badge
                                  key={subject.id}
                                  variant="outline"
                                  className="text-xs transition-colors group-hover:border-primary/50"
                                >
                                  {subject.name}
                                </Badge>
                              ))}
                              {cert.subjects.length > 6 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{cert.subjects.length - 6}
                                </Badge>
                              )}
                            </div>
                          </div>

                          {/* 선택 버튼 */}
                          <Button
                            variant={isSelected ? "default" : "outline"}
                            className="w-full"
                            disabled={isSelecting}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleClickSelectCert(cert);
                            }}
                          >
                            {isSelecting && isSelected ? (
                              <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                <span>선택 중...</span>
                              </div>
                            ) : isSelected ? (
                              <div className="flex items-center gap-2">
                                <CheckCircleIcon className="h-4 w-4" />
                                <span>선택됨</span>
                              </div>
                            ) : (
                              "선택하기"
                            )}
                          </Button>
                        </CardContent>
                      </div>
                    </Card>
                  );
                })}
              </div>

              {/* 빈 상태 */}
              {certifications.length === 0 && (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <GraduationCapIcon className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                    등록된 자격증이 없습니다
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    관리자에게 문의하여 자격증을 등록해보세요
                  </p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
