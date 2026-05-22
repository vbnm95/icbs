"use client";

import { Check, Circle, X } from "lucide-react";
import type { SurveyChoice } from "@/types/survey";

type ChoiceButtonProps = {
  choice: SurveyChoice;
  selected: boolean;
  onClick: () => void;
  layout?: "list" | "tile";
  multiple?: boolean;
};

export function ChoiceButton({
  choice,
  selected,
  onClick,
  layout = "list",
  multiple = false,
}: ChoiceButtonProps) {
  const MarkIcon = choice.icon === "x" ? X : choice.icon === "o" ? Circle : Check;
  const isTile = layout === "tile";

  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={[
        "group relative w-full border bg-white/90 text-left text-[#102B4D] shadow-soft transition",
        "hover:-translate-y-0.5 hover:border-[#4F8FEA]/70 active:translate-y-0",
        selected
          ? "border-[#4F8FEA] bg-[#F1F7FF] ring-2 ring-[#4F8FEA]/20"
          : "border-white/80",
        isTile
          ? "flex min-h-36 flex-col items-center justify-center gap-4 rounded-[26px] p-5 text-center"
          : "flex min-h-20 items-center gap-4 rounded-[24px] px-5 py-4",
      ].join(" ")}
    >
      <span
        className={[
          "grid shrink-0 place-items-center border transition",
          selected
            ? "border-[#4F8FEA] bg-gradient-to-br from-[#72A9F6] to-[#4F8FEA] text-white"
            : "border-slate-200 bg-[#EEF6FF] text-[#4F8FEA]",
          multiple ? "rounded-xl" : "rounded-full",
          isTile ? "size-16" : "size-12",
        ].join(" ")}
        aria-hidden="true"
      >
        {multiple && !selected ? null : (
          <MarkIcon className={isTile ? "size-10" : "size-7"} strokeWidth={selected ? 3 : 2.4} />
        )}
      </span>

      <span className={isTile ? "text-xl font-extrabold" : "text-lg font-extrabold"}>
        {choice.icon === "o" && "O "}
        {choice.icon === "x" && "X "}
        {choice.label}
      </span>

      {!isTile && selected ? (
        <span
          className="ml-auto grid size-7 place-items-center rounded-full bg-[#4F8FEA] text-white"
          aria-hidden="true"
        >
          <Check className="size-4" strokeWidth={3} />
        </span>
      ) : null}
    </button>
  );
}
