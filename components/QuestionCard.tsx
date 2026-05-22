import { Heart, PawPrint } from "lucide-react";

type QuestionCardProps = {
  question: string;
  subtitle?: string;
};

export function QuestionCard({ question, subtitle }: QuestionCardProps) {
  return (
    <section className="relative flex gap-3" aria-labelledby="survey-question">
      <div className="mt-8 grid size-16 shrink-0 place-items-center rounded-full bg-[#D9ECFF] shadow-sm">
        <span className="text-4xl" aria-hidden="true">
          🐶
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <div className="mb-2 flex items-center gap-2 text-base font-extrabold text-[#4F8FEA]">
          <span>인섹탈 가이드</span>
          <PawPrint className="size-4" aria-hidden="true" />
        </div>
        <div className="relative rounded-[26px] bg-white/95 px-5 py-5 text-[#101D2E] shadow-soft">
          <h2 id="survey-question" className="text-xl font-extrabold leading-relaxed">
            {question}
          </h2>
          {subtitle ? (
            <p className="mt-2 text-base font-semibold text-slate-500">{subtitle}</p>
          ) : null}
          <Heart
            className="absolute bottom-4 right-4 size-5 fill-[#4F8FEA] text-[#4F8FEA]"
            aria-hidden="true"
          />
        </div>
      </div>
    </section>
  );
}
