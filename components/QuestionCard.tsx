import Image from "next/image";
import { PawPrint } from "lucide-react";

type QuestionCardProps = {
  question: string;
  subtitle?: string;
};

export function QuestionCard({ question, subtitle }: QuestionCardProps) {
  return (
    <section className="relative flex gap-3" aria-labelledby="survey-question">
      <div className="mt-7 grid size-12 shrink-0 place-items-center overflow-hidden rounded-full bg-[#E8F4FF]">
        <Image
          src="/images/insectal-avatar.png"
          alt=""
          width={48}
          height={48}
          className="size-full object-cover"
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="mb-2 flex items-center gap-1.5 text-xs font-extrabold text-[#67A9FF]">
          <span>인섹탈 가이드</span>
          <PawPrint className="size-3.5" aria-hidden="true" />
        </div>
        <div className="rounded-[24px] border border-[#E7EEF7] bg-white px-5 py-5 text-[#101D2E] shadow-soft">
          <h2 id="survey-question" className="text-lg font-extrabold leading-relaxed">
            {question}
          </h2>
          {subtitle ? (
            <p className="mt-2 text-sm font-semibold text-[#6B7B8B]">{subtitle}</p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
