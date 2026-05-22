import { ArrowLeft, Gift, Heart, PawPrint } from "lucide-react";
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
  showEventBadge?: boolean;
};

export function SurveyLayout({
  children,
  progress,
  title = "우리 아이 구충제 체크",
  subtitle = "간단한 설문에 답하고 부스 사은품을 받아보세요",
  stepNumber,
  totalSteps = 6,
  showBack = false,
  onBack,
  showEventBadge = true,
}: SurveyLayoutProps) {
  return (
    <main className="flex min-h-[100svh] justify-center bg-[#F8F4EE] text-[#173B67] sm:p-6">
      <div className="relative min-h-[100svh] w-full max-w-[430px] overflow-hidden bg-[#FFFCF6] px-5 pb-[calc(24px+env(safe-area-inset-bottom))] pt-7 shadow-2xl sm:min-h-[920px] sm:rounded-[48px] sm:border-[10px] sm:border-[#101114] sm:px-6 sm:pt-14">
        <div
          className="pointer-events-none absolute left-1/2 top-5 z-20 hidden h-9 w-32 -translate-x-1/2 rounded-full bg-black sm:block"
          aria-hidden="true"
        />
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute -bottom-8 left-1/2 h-36 w-[130%] -translate-x-1/2 rounded-t-[50%] bg-[#E7F3FF]" />
          <PawPrint className="absolute right-8 top-[38%] size-16 rotate-12 text-orange-100" />
          <PawPrint className="absolute bottom-40 left-6 size-10 -rotate-12 text-orange-100" />
          <Heart className="absolute right-10 top-24 size-9 text-[#83B4F5]" />
          <Heart className="absolute bottom-52 right-16 size-6 fill-[#4F8FEA] text-[#4F8FEA]" />
          <span className="absolute left-9 bottom-48 text-3xl text-[#83B4F5]">⌁</span>
          <span className="absolute right-8 bottom-28 text-2xl text-orange-200">✦</span>
        </div>

        <div className="relative z-10">
          <div className="mb-5 flex h-9 items-center justify-between">
            {showBack ? (
              <button
                type="button"
                onClick={onBack}
                className="grid size-9 place-items-center rounded-full text-[#286BC8] transition hover:bg-[#EAF3FF]"
                aria-label="이전 질문으로 돌아가기"
              >
                <ArrowLeft className="size-6" />
              </button>
            ) : (
              <span className="size-9" aria-hidden="true" />
            )}

            {stepNumber ? (
              <div className="rounded-full bg-[#EEF6FF] px-5 py-1.5 text-lg font-extrabold text-[#4F8FEA]">
                {stepNumber} / {totalSteps}
              </div>
            ) : (
              <span aria-hidden="true" />
            )}

            <div
              className="grid size-11 place-items-center rounded-full border-2 border-[#9AC3F7] bg-white/70 text-[#4F8FEA]"
              aria-hidden="true"
            >
              <Heart className="size-5 fill-[#6FA8F4]" />
            </div>
          </div>

          <header className="text-center">
            <h1 className="text-[2rem] font-black leading-tight tracking-normal text-[#173B67] sm:text-[2.15rem]">
              {title}
              <PawPrint className="ml-1 inline size-5 text-[#4F8FEA]" aria-hidden="true" />
            </h1>
            <p className="mt-3 text-base font-semibold leading-relaxed text-slate-600">
              {subtitle}
            </p>
            {showEventBadge ? (
              <div className="mx-auto mt-5 inline-flex max-w-full items-center gap-3 rounded-full border border-slate-200 bg-white/85 px-4 py-2 text-sm font-bold text-slate-800 shadow-sm">
                <span className="inline-flex items-center gap-1.5 text-[#F97316]">
                  <Gift className="size-5" aria-hidden="true" />
                  부스 이벤트
                </span>
                <span className="h-5 w-px bg-slate-200" aria-hidden="true" />
                <span>설문 완료 시 사은품 증정</span>
              </div>
            ) : null}
          </header>

          <div className="mt-7">
            <ProgressBar progress={progress} />
          </div>

          {children}
        </div>
      </div>
    </main>
  );
}
