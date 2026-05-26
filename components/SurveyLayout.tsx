import Image from "next/image";
import { ArrowLeft, Heart } from "lucide-react";
import { ProgressBar } from "@/components/ProgressBar";

type SurveyLayoutProps = {
  children: React.ReactNode;
  progress: number;
  title?: string;
  subtitle?: string;
  stepNumber?: number;
  totalSteps?: number;
  showBack?: boolean;
  onBack?: () => void;
};

export function SurveyLayout({
  children,
  progress,
  title = "우리 아이 구충제, 어떻게 사용하고 계신가요?",
  subtitle,
  stepNumber,
  totalSteps = 6,
  showBack = false,
  onBack,
}: SurveyLayoutProps) {
  const compact = Boolean(stepNumber);

  return (
    <main className="flex min-h-[100svh] justify-center bg-[#EEF7FF] text-[#0F345A] sm:p-1">
      <div className="relative min-h-[100svh] w-full max-w-[430px] overflow-hidden bg-[#FFFDF9] px-8 pb-[calc(26px+env(safe-area-inset-bottom))] pt-7 shadow-[0_26px_70px_rgba(73,139,213,0.24)] sm:min-h-[790px] sm:rounded-[34px] sm:border sm:border-[#DCEEFF]">
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#EAF5FF] to-transparent"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -right-20 top-28 size-48 rounded-full bg-[#EAF5FF] blur-3xl"
          aria-hidden="true"
        />

        <div className="relative z-10">
          <div className="mb-2 flex h-12 items-center justify-between">
            {showBack ? (
              <button
                type="button"
                onClick={onBack}
                className="grid size-11 place-items-center rounded-full border border-[#D6E9FF] bg-white text-[#5A9BED] shadow-sm transition hover:bg-[#F3F9FF]"
                aria-label="이전 질문으로 돌아가기"
              >
                <ArrowLeft className="size-5" />
              </button>
            ) : (
              <span className="size-11" aria-hidden="true" />
            )}

            {stepNumber ? (
              <div className="rounded-full bg-[#EEF6FF] px-4 py-1.5 text-sm font-extrabold text-[#5A9BED]">
                {stepNumber} / {totalSteps}
              </div>
            ) : (
              <span aria-hidden="true" />
            )}

            <div
              className="grid size-11 place-items-center rounded-full border-2 border-[#9AC9FF] bg-white text-[#75B0F4]"
              aria-hidden="true"
            >
              <Heart className="size-5" />
            </div>
          </div>

          <header className="text-center">
            <Image
              src="/images/valvet.png"
              alt="VALVET Ltd."
              width={170}
              height={57}
              priority
              className="mx-auto h-auto w-[118px]"
            />
            <h1
              className={[
                "font-black leading-tight tracking-normal text-[#123D67]",
                compact ? "mt-5 text-[1.65rem]" : "mt-8 text-[1.9rem]",
              ].join(" ")}
            >
              {title}
            </h1>
            {subtitle ? (
              <p className="mx-auto mt-3 max-w-[18rem] text-sm font-semibold leading-relaxed text-[#6B7B8B]">
                {subtitle}
              </p>
            ) : null}
          </header>

          <div className={compact ? "mt-5" : "mt-10"}>
            <ProgressBar progress={progress} />
          </div>

          {children}
        </div>
      </div>
    </main>
  );
}
