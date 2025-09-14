import ProgressBar from "@/_components/progressBar";
import { Suspense } from "react";

export default function CreateLayout({
  children,
  content,
}: {
  children: React.ReactNode;
  content?: React.ReactNode;
}) {
  return (
    <div className="h-full w-full ">
      <section
        id="main_section"
        className="flex flex-row overflow-hidden  h-full w-full"
      >
        <section className="w-72 h-full overflow-y-hidden border-r-2 border-r-border/50  ">
          <div className="relative w-full flex h-full grow ">
            <div className="flex-1 overflow-y-hidden ">
              <ProgressBar />
            </div>
          </div>
        </section>

        {/* 오른쪽 절반 - 고정 영역 */}
        <section className="flex flex-col flex-5/7 h-full overflow-y-auto gap-4 pl-4">
          <Suspense fallback={<div>Loading...</div>}>{content}</Suspense>
        </section>
      </section>
    </div>
  );
}
