"use client";

import { Bug, Check, Gift, HeartPulse, Pipette, RotateCcw, ShieldCheck } from "lucide-react";
import { SurveyLayout } from "@/components/SurveyLayout";

type CompletionScreenProps = {
  onReset: () => void;
};

const benefitCards = [
  { label: "심장사상충", Icon: HeartPulse },
  { label: "진드기 관리", Icon: Bug },
  { label: "바르는 Spot-on", Icon: Pipette },
];

export function CompletionScreen({ onReset }: CompletionScreenProps) {
  return (
    <SurveyLayout
      progress={100}
      title="설문 완료!"
      subtitle="참여해주셔서 감사합니다"
      showEventBadge={false}
    >
      <section className="mt-7 space-y-5">
        <div className="mx-auto flex w-fit items-center gap-3 rounded-[24px] border border-[#CFE4FF] bg-[#EEF6FF] px-6 py-4 text-xl font-black text-[#4F8FEA] shadow-soft">
          <Gift className="size-9 text-[#F5A623]" aria-hidden="true" />
          사은품 증정 대상
        </div>

        <div className="relative overflow-hidden rounded-[30px] bg-white/95 p-6 shadow-soft">
          <div className="absolute left-4 top-4 text-5xl" aria-hidden="true">
            🐶
          </div>
          <div className="ml-20 min-h-28 py-2 text-2xl font-black leading-relaxed text-[#101D2E]">
            설문 참여 확인 후
            <br />
            인섹탈 콤보 
            <br />
            안내서를 받으시면
            <br />
            웰케어 데일리 5일치
            <br />
            체험팩을 드립니다.
          </div>
          <ShieldCheck
            className="absolute bottom-5 right-5 size-10 text-[#4F8FEA]"
            aria-hidden="true"
          />
        </div>

        <div className="rounded-[26px] bg-white/90 p-5 shadow-soft">
          <div className="flex items-center gap-3 border-b border-dashed border-slate-200 pb-4 text-base font-bold text-slate-700">
            <span className="grid size-8 place-items-center rounded-full bg-[#4F8FEA] text-white">
              <Check className="size-5" strokeWidth={3} aria-hidden="true" />
            </span>
            응답이 정상적으로 제출되었습니다
          </div>
          <div className="flex items-center gap-3 pt-4 text-base font-bold text-slate-700">
            <span className="grid size-8 place-items-center rounded-full bg-[#4F8FEA] text-white">
              <Check className="size-5" strokeWidth={3} aria-hidden="true" />
            </span>
            현장에서 바로 사은품을 수령하세요
          </div>
        </div>

        <div className="flex items-end justify-center gap-3 pt-2" aria-hidden="true">
          <span className="text-6xl">🐶</span>
          <span className="text-6xl">🐕</span>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {benefitCards.map(({ label, Icon }) => (
            <div
              key={label}
              className="rounded-[22px] bg-white/95 px-2 py-5 text-center shadow-soft"
            >
              <div className="mx-auto grid size-14 place-items-center rounded-full bg-[#E7F3FF] text-[#286BC8]">
                <Icon className="size-8" aria-hidden="true" />
              </div>
              <p className="mt-3 text-sm font-black leading-snug text-[#101D2E]">{label}</p>
            </div>
          ))}
        </div>

        <div className="pt-2 text-center">
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm font-bold text-slate-500 shadow-sm transition hover:text-[#286BC8]"
          >
            <RotateCcw className="size-4" aria-hidden="true" />
            처음으로 돌아가기
          </button>
        </div>
      </section>
    </SurveyLayout>
  );
}
