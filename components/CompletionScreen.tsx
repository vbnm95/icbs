"use client";

import Image from "next/image";
import { Check, Gift, HeartPulse, Pipette, RotateCcw, ShieldCheck, Sparkles } from "lucide-react";
import { SurveyLayout } from "@/components/SurveyLayout";

type CompletionScreenProps = {
  onReset: () => void;
};

const benefitCards = [
  { label: "구충 관리", Icon: HeartPulse },
  { label: "인섹탈 콤보", Icon: Pipette },
  { label: "5일치 체험팩", Icon: Sparkles },
];

export function CompletionScreen({ onReset }: CompletionScreenProps) {
  return (
    <SurveyLayout
      progress={100}
      title="설문에 참여해 주셔서 감사합니다 :)"
      subtitle="설문 참여 확인 후 인섹탈 콤보 안내서를 받으시면 웰케어 데일리 5일치 체험팩을 드립니다!"
    >
      <section className="mt-8 space-y-5">
        <div className="mx-auto flex w-fit items-center gap-3 rounded-[22px] border border-[#D6E9FF] bg-[#F3F9FF] px-5 py-4 text-lg font-black text-[#4D8CDC] shadow-soft">
          <Gift className="size-8 text-[#F4A942]" aria-hidden="true" />
          사은품 안내
        </div>

        <div className="relative overflow-hidden rounded-[24px] border border-[#E7EEF7] bg-white p-6 shadow-soft">
          <div className="ml-16 min-h-28 py-1 text-xl font-black leading-relaxed text-[#101D2E]">
            인섹탈 콤보 안내서를 
            <br />
            받으시면
            <br />
            웰케어 데일리 5일치
            <br />
            체험팩을 드립니다!
          </div>
          <Image
            src="/images/insectal-avatar.png"
            alt=""
            width={64}
            height={64}
            className="absolute left-5 top-5 size-14 rounded-full object-cover"
          />
          <ShieldCheck
            className="absolute bottom-5 right-5 size-9 text-[#67A8F2]"
            aria-hidden="true"
          />
        </div>

        <div className="rounded-[22px] border border-[#E7EEF7] bg-white p-5 shadow-soft">
          <div className="flex items-center gap-3 border-b border-dashed border-[#D8E2EC] pb-4 text-sm font-bold text-[#4F5F70]">
            <span className="grid size-8 place-items-center rounded-full bg-[#67A8F2] text-white">
              <Check className="size-5" strokeWidth={3} aria-hidden="true" />
            </span>
            응답이 정상적으로 제출되었습니다.
          </div>
          <div className="flex items-center gap-3 pt-4 text-sm font-bold text-[#4F5F70]">
            <span className="grid size-8 place-items-center rounded-full bg-[#67A8F2] text-white">
              <Check className="size-5" strokeWidth={3} aria-hidden="true" />
            </span>
            감사합니다.
          </div>
        </div>

        <Image
          src="/images/welcare-pets.png"
          alt=""
          width={480}
          height={240}
          className="mx-auto h-auto w-full max-w-[280px] rounded-[18px] object-contain"
        />

        <div className="grid grid-cols-3 gap-3">
          {benefitCards.map(({ label, Icon }) => (
            <div
              key={label}
              className="rounded-[20px] border border-[#E7EEF7] bg-white px-2 py-4 text-center shadow-soft"
            >
              <div className="mx-auto grid size-12 place-items-center rounded-full bg-[#E7F3FF] text-[#4D8CDC]">
                <Icon className="size-7" aria-hidden="true" />
              </div>
              <p className="mt-3 text-xs font-black leading-snug text-[#101D2E]">{label}</p>
            </div>
          ))}
        </div>

        <div className="pt-1 text-center">
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-2 rounded-full border border-[#D6E9FF] bg-white px-4 py-2 text-sm font-bold text-[#6B7B8B] shadow-sm transition hover:text-[#4D8CDC]"
          >
            <RotateCcw className="size-4" aria-hidden="true" />
            처음으로 돌아가기
          </button>
        </div>
      </section>
    </SurveyLayout>
  );
}
