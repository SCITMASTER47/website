"use client";
import { useRef, useEffect, useState } from "react";

export default function CertifyLogo({
  loading = false,
}: {
  loading?: boolean;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [eyePos, setEyePos] = useState({
    left: { x: 15, y: 24 },
    right: { x: 25, y: 24 },
  });

  useEffect(() => {
    if (loading) {
      // 부드러운 눈동자 이동 애니메이션
      let direction = "right";
      let targetLeft = { x: 18, y: 24 };
      let targetRight = { x: 28, y: 24 };
      let frame: number;
      const speed = 0.25; // 이동 속도 (0~1)
      const animate = () => {
        setEyePos((prev) => {
          const lerp = (a: number, b: number) => a + (b - a) * speed;
          return {
            left: {
              x: lerp(prev.left.x, targetLeft.x),
              y: lerp(prev.left.y, targetLeft.y),
            },
            right: {
              x: lerp(prev.right.x, targetRight.x),
              y: lerp(prev.right.y, targetRight.y),
            },
          };
        });
        frame = requestAnimationFrame(animate);
      };
      animate();
      const interval = setInterval(() => {
        if (direction === "right") {
          targetLeft = { x: 12, y: 24 };
          targetRight = { x: 22, y: 24 };
          direction = "left";
        } else {
          targetLeft = { x: 18, y: 24 };
          targetRight = { x: 28, y: 24 };
          direction = "right";
        }
      }, 1000);
      return () => {
        clearInterval(interval);
        cancelAnimationFrame(frame);
      };
    }
    const handleMouseMove = (e: MouseEvent) => {
      if (!svgRef.current) return;
      const rect = svgRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      // 얼굴 중심 기준
      const centerX = 20;
      const centerY = 24;
      // 눈동자 최대 이동 반경
      const maxDist = 2;
      // 각 눈 위치
      const leftEye = { x: 15, y: 24 };
      const rightEye = { x: 25, y: 24 };
      // 방향 벡터 계산
      const dx = mouseX - centerX;
      const dy = mouseY - centerY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const ratio = dist > 0 ? Math.min(maxDist / dist, 1) : 0;
      setEyePos({
        left: {
          x: leftEye.x + dx * ratio,
          y: leftEye.y + dy * ratio,
        },
        right: {
          x: rightEye.x + dx * ratio,
          y: rightEye.y + dy * ratio,
        },
      });
    };
    const svg = svgRef.current;
    if (svg && !loading) {
      svg.addEventListener("mousemove", handleMouseMove);
      svg.addEventListener("mouseleave", () =>
        setEyePos({ left: { x: 15, y: 24 }, right: { x: 25, y: 24 } })
      );
    }
    return () => {
      if (svg && !loading) {
        svg.removeEventListener("mousemove", handleMouseMove);
        svg.removeEventListener("mouseleave", () =>
          setEyePos({ left: { x: 15, y: 24 }, right: { x: 25, y: 24 } })
        );
      }
    };
  }, [loading]);

  return (
    <svg
      ref={svgRef}
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      style={{ cursor: "pointer" }}
    >
      {/* 얼굴 (중앙으로 이동) */}
      <ellipse cx="32" cy="32" rx="16" ry="13" fill="#fff" />
      {/* 눈동자 (중앙 기준으로 y값 조정) */}
      <ellipse
        cx={eyePos.left.x * 1.6}
        cy={eyePos.left.y * 1.6 - 9.6}
        rx="5.6"
        ry="6.4"
        fill="#7c3aed"
      />
      <ellipse
        cx={eyePos.right.x * 1.6}
        cy={eyePos.right.y * 1.6 - 9.6}
        rx="5.6"
        ry="6.4"
        fill="#7c3aed"
      />
      {/* 반짝임 */}
      <ellipse
        cx={eyePos.left.x * 1.6 - 1.6}
        cy={eyePos.left.y * 1.6 - 1.6 - 9.6}
        rx="1.6"
        ry="1.92"
        fill="#fff"
      />
      <ellipse
        cx={eyePos.right.x * 1.6 - 1.6}
        cy={eyePos.right.y * 1.6 - 1.6 - 9.6}
        rx="1.6"
        ry="1.92"
        fill="#fff"
      />
      {/* 귀여운 미소 (중앙 기준으로 y값 조정) */}
      <path
        d="M25.6 40 Q32 44.8 38.4 40"
        stroke="#a78bfa"
        strokeWidth="2.4"
        fill="none"
      />
    </svg>
  );
}
