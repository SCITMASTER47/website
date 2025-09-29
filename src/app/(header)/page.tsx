"use client";

import useAuthStore from "@/_store/auth";
import Link from "next/link";
import { Button } from "@/_ui/button";
import { Card } from "@/_ui/card";
import { Badge } from "@/_ui/badge";
import { CalendarIcon, BookIcon, TimerIcon } from "@/_ui/svg/svg";
import { TypewriterText } from "@/_components/TypewriterText";
import { useState } from "react";

export default function Home() {
  const { user, logout } = useAuthStore();
  const [showDescription, setShowDescription] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight min-h-[120px] md:min-h-[180px]">
              <TypewriterText
                text="AI가 만들어주는"
                speed={100}
                className="text-primary"
                onComplete={() => setShowDescription(true)}
              />
              <br />
              맞춤형 학습 스케줄
            </h1>
            {showDescription && (
              <div className="animate-fade-in">
                <span className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed block">
                  당신의 목표와 수준에 맞춰 AI가 최적화된 학습 계획을
                  생성합니다. 더 효율적이고 체계적인 학습을 시작해보세요.
                </span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {user ? (
                <>
                  <Link href="/dashboard">
                    <Button
                      size="lg"
                      className="text-lg px-8 py-6 bg-primary hover:bg-primary/90 shadow-lg"
                    >
                      📊 대시보드로 이동
                    </Button>
                  </Link>
                  <Link href="/create/certification">
                    <Button
                      size="lg"
                      variant="outline"
                      className="text-lg px-8 py-6"
                    >
                      🤖 AI 스케줄 생성
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/auth/login">
                    <Button
                      size="lg"
                      className="text-lg px-8 py-6 bg-primary hover:bg-primary/90 shadow-lg"
                    >
                      🚀 지금 시작하기
                    </Button>
                  </Link>
                  <Link href="/auth/signUp">
                    <Button
                      size="lg"
                      variant="outline"
                      className="text-lg px-8 py-6"
                    >
                      회원가입
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {user && (
              <div className="mt-8 p-4 bg-primary/5 rounded-2xl border border-primary/10">
                <p className="text-primary font-medium">
                  안녕하세요, {user.email}님! 👋
                </p>
                <button
                  onClick={logout}
                  className="mt-2 text-sm text-gray-600 hover:text-gray-800 underline"
                >
                  로그아웃
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              왜 AI 학습 플래너를 선택해야 할까요?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              전통적인 학습 계획의 한계를 뛰어넘어, 개인 맞춤형 최적화된 학습
              경험을 제공합니다.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card className="p-8 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 hover:shadow-lg transition-all duration-300">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CalendarIcon />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  개인 맞춤 일정
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  당신의 학습 속도와 라이프스타일을 분석하여 가장 효과적인 학습
                  일정을 AI가 자동으로 생성합니다.
                </p>
              </div>
            </Card>

            {/* Feature 2 */}
            <Card className="p-8 bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20 hover:shadow-lg transition-all duration-300">
              <div className="text-center">
                <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BookIcon />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  스마트 진도 관리
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  학습 진행상황을 실시간으로 추적하고 필요에 따라 일정을
                  동적으로 조정하여 최적의 학습 효과를 보장합니다.
                </p>
              </div>
            </Card>

            {/* Feature 3 */}
            <Card className="p-8 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all duration-300">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <TimerIcon />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  효율적인 시간 관리
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  각 과목별 중요도와 난이도를 고려하여 한정된 시간을 가장
                  효과적으로 활용할 수 있도록 도와줍니다.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-20 bg-gradient-to-r from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge
                variant="outline"
                className="mb-4 text-primary border-primary/20 bg-primary/5"
              >
                🎯 실제 사용 예시
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                3단계로 완성되는
                <br />
                나만의 학습 계획
              </h2>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      목표 설정
                    </h3>
                    <p className="text-gray-600">
                      시험 종류, 목표 점수, 학습 가능한 시간을 입력하세요.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      AI 분석
                    </h3>
                    <p className="text-gray-600">
                      AI가 당신의 정보를 분석하여 최적의 학습 전략을 수립합니다.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      스케줄 완성
                    </h3>
                    <p className="text-gray-600">
                      개인 맞춤형 학습 일정이 완성되어 바로 학습을 시작할 수
                      있습니다.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <Link href={user ? "/create" : "/auth/signup"}>
                  <Button size="lg" className="bg-primary hover:bg-primary/90">
                    {user ? "🤖 AI 스케줄 생성하기" : "무료로 시작하기"}
                  </Button>
                </Link>
              </div>
            </div>

            <div className="lg:order-first">
              <Card className="p-6 bg-white shadow-2xl border-0">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">
                      📚 정보처리기사 학습 계획
                    </h3>
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      진행 중
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    <div className="p-3 bg-gray-50 rounded-lg border-l-4 border-l-primary/30">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">
                          소프트웨어 설계
                        </span>
                        <span className="text-xs text-gray-500">2시간</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <CalendarIcon />
                        <span>2025.01.15</span>
                        <BookIcon />
                        <span>p.45-67</span>
                      </div>
                    </div>

                    <div className="p-3 bg-gray-50 rounded-lg border-l-4 border-l-accent/30">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">
                          데이터베이스 구축
                        </span>
                        <span className="text-xs text-gray-500">1.5시간</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <CalendarIcon />
                        <span>2025.01.16</span>
                        <BookIcon />
                        <span>p.120-145</span>
                      </div>
                    </div>

                    <div className="p-3 bg-gray-50 rounded-lg border-l-4 border-l-blue-300">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">
                          프로그래밍 언어 활용
                        </span>
                        <span className="text-xs text-gray-500">2.5시간</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <CalendarIcon />
                        <span>2025.01.17</span>
                        <BookIcon />
                        <span>p.200-235</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">전체 진행률</span>
                      <span className="font-semibold text-primary">68%</span>
                    </div>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: "68%" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            이미 많은 학습자들이 선택했습니다
          </h2>
          <p className="text-lg text-gray-600 mb-12">
            AI 기반 학습 플래너로 더 효과적인 학습을 경험해보세요
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                3+
              </div>
              <p className="text-gray-600 font-medium">활성 사용자</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-accent mb-2">
                98%
              </div>
              <p className="text-gray-600 font-medium">학습 효율 향상</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">
                100%
              </div>
              <p className="text-gray-600 font-medium">목표 달성률</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-accent">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            지금 바로 시작하세요
          </h2>
          <p className="text-xl text-white/90 mb-10">
            AI가 만들어주는 맞춤형 학습 계획으로 당신의 목표를 달성하세요
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={user ? "/create" : "/auth/signUp"}>
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-gray-100 text-lg px-8 py-6 shadow-lg"
              >
                🚀 무료로 시작하기
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-400 mb-8">
              AI 기반 스마트 학습 플래너로 더 나은 학습 경험을 만들어갑니다
            </p>
            <div className="text-sm text-gray-500">
              &copy; 2025 Scitmaster Team Project. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
