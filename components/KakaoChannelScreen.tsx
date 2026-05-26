"use client";

import Image from "next/image";
import { ArrowRight, ExternalLink, Gift, MessageCircle, ShieldCheck } from "lucide-react";
import { SurveyLayout } from "@/components/SurveyLayout";

const KAKAO_CHANNEL_URL = process.env.NEXT_PUBLIC_KAKAO_CHANNEL_URL ?? "";

type KakaoChannelScreenProps = {
  isSubmitting: boolean;
  submitError: string;
  onBack: () => void;
  onSubmit: () => void;
};

export function KakaoChannelScreen({
  isSubmitting,
  submitError,
  onBack,
  onSubmit,
}: KakaoChannelScreenProps) {
  const hasChannelUrl = KAKAO_CHANNEL_URL.length > 0;

  return (
    <SurveyLayout
      progress={98}
      title="웰케어 카카오톡 채널 추가"
      subtitle="채널을 추가하시면 할인 및 이벤트 소식을 더 편하게 받아보실 수 있어요."
      showBack={!isSubmitting}
      onBack={onBack}
    >
      <section className="mt-8 space-y-5">
        <div className="rounded-[26px] border border-[#F7DF7C] bg-[#FFE75A] p-5 text-[#2B2110] shadow-soft">
          <div className="flex items-center gap-3">
            <span className="grid size-12 shrink-0 place-items-center rounded-full bg-[#2B2110] text-[#FFE75A]">
              <MessageCircle className="size-7" aria-hidden="true" />
            </span>
            <div>
              <p className="text-lg font-black">웰케어 채널 추가</p>
              <p className="mt-1 text-sm font-bold leading-relaxed">
                카카오톡에서 웰케어 소식을 받아보세요.
              </p>
            </div>
          </div>

          <a
            href={hasChannelUrl ? KAKAO_CHANNEL_URL : undefined}
            target="_blank"
            rel="noreferrer"
            aria-disabled={!hasChannelUrl}
            className={[
              "mt-5 flex min-h-14 w-full items-center justify-center gap-2 rounded-[18px] bg-[#2B2110] px-5 text-base font-black text-white transition",
              hasChannelUrl
                ? "hover:-translate-y-0.5 active:translate-y-0"
                : "pointer-events-none opacity-45",
            ].join(" ")}
          >
            <span>카카오톡 채널 추가하기</span>
            <ExternalLink className="size-5" aria-hidden="true" />
          </a>
        </div>

        {!hasChannelUrl ? (
          <div className="rounded-[22px] border border-orange-200 bg-orange-50 px-4 py-3 text-sm font-bold leading-relaxed text-orange-700">
            카카오톡 채널 URL을 연결하면 이 버튼이 활성화됩니다.
          </div>
        ) : null}

        <div className="rounded-[24px] border border-[#E7EEF7] bg-white p-5 shadow-soft">
          <div className="flex items-start gap-3 text-sm font-bold leading-relaxed text-[#4F5F70]">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#67A8F2] text-white">
              <Gift className="size-5" aria-hidden="true" />
            </span>
            <span>채널 추가 후 아래 버튼을 눌러 설문 제출을 완료해주세요.</span>
          </div>
          <div className="mt-4 flex items-start gap-3 text-sm font-bold leading-relaxed text-[#4F5F70]">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#67A8F2] text-white">
              <ShieldCheck className="size-5" aria-hidden="true" />
            </span>
            <span>응답은 Google Form으로 제출되고, 완료 화면에서 사은품 안내를 확인할 수 있어요.</span>
          </div>
        </div>

        <Image
          src="/images/welcare-pets.png"
          alt=""
          width={420}
          height={210}
          className="mx-auto h-auto w-full max-w-[250px] rounded-[18px] object-contain"
        />

        {submitError ? (
          <div
            role="alert"
            className="rounded-[22px] border border-orange-200 bg-orange-50 px-4 py-3 text-sm font-bold leading-relaxed text-orange-700"
          >
            {submitError}
          </div>
        ) : null}

        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="flex min-h-16 w-full items-center justify-center gap-5 rounded-[22px] bg-[#67A8F2] px-6 text-xl font-black text-white shadow-button transition enabled:hover:-translate-y-0.5 enabled:active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-45"
        >
          <span>{isSubmitting ? "제출 중..." : "설문 제출 완료하기"}</span>
          <ArrowRight className="size-7" aria-hidden="true" />
        </button>
      </section>
    </SurveyLayout>
  );
}
