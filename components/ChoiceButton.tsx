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
        "group relative w-full border bg-white text-left text-[#102B4D] shadow-soft transition",
        "hover:-translate-y-0.5 hover:border-[#67A8F2]/80 active:translate-y-0",
        selected
          ? "border-[#67A8F2] bg-[#F3F9FF] ring-2 ring-[#67A8F2]/20"
          : "border-[#E7EEF7]",
        isTile
          ? "flex min-h-32 flex-col items-center justify-center gap-3 rounded-[22px] p-4 text-center"
          : "flex min-h-16 items-center gap-4 rounded-[22px] px-4 py-3",
      ].join(" ")}
    >
      <span
        className={[
          "grid shrink-0 place-items-center border transition",
          selected
            ? "border-[#67A8F2] bg-[#67A8F2] text-white"
            : "border-[#DCE9F6] bg-[#F0F7FF] text-[#67A8F2]",
          multiple ? "rounded-xl" : "rounded-full",
          isTile ? "size-14" : "size-11",
        ].join(" ")}
        aria-hidden="true"
      >
        {multiple && !selected ? null : (
          <MarkIcon className={isTile ? "size-8" : "size-6"} strokeWidth={selected ? 3 : 2.4} />
        )}
      </span>

      <span className={isTile ? "text-base font-extrabold" : "text-base font-extrabold"}>
        {choice.label}
      </span>

      {!isTile && selected ? (
        <span
          className="ml-auto grid size-7 place-items-center rounded-full bg-[#67A8F2] text-white"
          aria-hidden="true"
        >
          <Check className="size-4" strokeWidth={3} />
        </span>
      ) : null}
    </button>
  );
}
