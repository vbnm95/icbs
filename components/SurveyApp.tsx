"use client";

import { FormEvent, useMemo, useState } from "react";
import {
  ArrowRight,
  Check,
  Clock3,
  Info,
  Lightbulb,
  LockKeyhole,
  Phone,
  Pipette,
  ShieldCheck,
  User,
} from "lucide-react";
import { ChoiceButton } from "@/components/ChoiceButton";
import { CompletionScreen } from "@/components/CompletionScreen";
import { QuestionCard } from "@/components/QuestionCard";
import { SurveyLayout } from "@/components/SurveyLayout";
import {
  INITIAL_SURVEY_ANSWERS,
  SURVEY_STEPS,
  formatPhoneNumber,
  validateAllAnswers,
  validateStepAnswer,
} from "@/lib/survey";
import type { SurveyAnswers, SurveyStepId } from "@/types/survey";

const TOTAL_STEPS = SURVEY_STEPS.length;

export function SurveyApp() {
  const [answers, setAnswers] = useState<SurveyAnswers>(INITIAL_SURVEY_ANSWERS);
  const [stepIndex, setStepIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);

  const currentStep = SURVEY_STEPS[stepIndex];
  const canContinue = useMemo(
    () => validateStepAnswer(currentStep.id, answers),
    [answers, currentStep.id],
  );
  const isLastStep = stepIndex === TOTAL_STEPS - 1;

  function updateAnswer<Key extends keyof SurveyAnswers>(key: Key, value: SurveyAnswers[Key]) {
    setAnswers((current) => ({ ...current, [key]: value }));
    setSubmitError("");
  }

  function toggleReason(reason: string) {
    setAnswers((current) => {
      const exists = current.reasons.includes(reason);

      return {
        ...current,
        reasons: exists
          ? current.reasons.filter((selectedReason) => selectedReason !== reason)
          : [...current.reasons, reason],
      };
    });
    setSubmitError("");
  }

  function goBack() {
    if (isSubmitting || stepIndex === 0) {
      return;
    }

    setStepIndex((current) => current - 1);
    setSubmitError("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canContinue || isSubmitting) {
      return;
    }

    if (!isLastStep) {
      setStepIndex((current) => current + 1);
      setSubmitError("");
      return;
    }

    const validation = validateAllAnswers(answers);

    if (!validation.ok) {
      setSubmitError("필수 문항을 확인해주세요.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(answers),
      });

      if (!response.ok) {
        throw new Error("Survey submission failed.");
      }

      setIsCompleted(true);
    } catch {
      setSubmitError("제출에 실패했습니다. 부스 직원에게 문의해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function resetSurvey() {
    setAnswers(INITIAL_SURVEY_ANSWERS);
    setStepIndex(0);
    setSubmitError("");
    setIsCompleted(false);
  }

  if (isCompleted) {
    return <CompletionScreen onReset={resetSurvey} />;
  }

  return (
    <SurveyLayout
      progress={currentStep.progress}
      stepNumber={stepIndex > 0 ? stepIndex + 1 : undefined}
      totalSteps={TOTAL_STEPS}
      showBack={stepIndex > 0}
      onBack={goBack}
    >
      <form onSubmit={handleSubmit} className="mt-7 space-y-5">
        <QuestionCard question={currentStep.question} subtitle={currentStep.subtitle} />

        {currentStep.kind === "text" || currentStep.kind === "phone" ? (
          <InputQuestion
            stepId={currentStep.id}
            label={currentStep.fieldLabel ?? ""}
            placeholder={currentStep.placeholder ?? ""}
            value={currentStep.id === "name" ? answers.name : answers.phone}
            onChange={(value) => {
              if (currentStep.id === "phone") {
                updateAnswer("phone", formatPhoneNumber(value));
                return;
              }

              updateAnswer("name", value);
            }}
            helperText={currentStep.helperText}
          />
        ) : null}

        {currentStep.kind === "single" && currentStep.choices ? (
          <SingleChoiceQuestion
            stepId={currentStep.id}
            answers={answers}
            onSelect={(value) => updateAnswer(currentStep.id as keyof SurveyAnswers, value)}
          />
        ) : null}

        {currentStep.kind === "multi" && currentStep.choices ? (
          <div className="space-y-3">
            {currentStep.choices.map((choice) => (
              <ChoiceButton
                key={choice.value}
                choice={choice}
                selected={answers.reasons.includes(choice.value)}
                multiple
                onClick={() => toggleReason(choice.value)}
              />
            ))}
          </div>
        ) : null}

        <InfoPanel stepId={currentStep.id} helperText={currentStep.helperText} />

        {submitError ? (
          <div
            role="alert"
            className="rounded-[22px] border border-orange-200 bg-orange-50 px-4 py-3 text-sm font-bold leading-relaxed text-orange-700"
          >
            {submitError}
          </div>
        ) : null}

        <PetPeek />

        <button
          type="submit"
          disabled={!canContinue || isSubmitting}
          className="flex min-h-16 w-full items-center justify-center gap-4 rounded-[24px] bg-gradient-to-r from-[#72A9F6] to-[#3F7FE2] px-6 text-2xl font-black text-white shadow-button transition enabled:hover:-translate-y-0.5 enabled:active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-45"
        >
          <span>{isSubmitting ? "제출 중..." : currentStep.cta ?? "다음"}</span>
          <ArrowRight className="size-8" aria-hidden="true" />
        </button>

        <div className="text-center">
          <span className="inline-flex rounded-full border border-slate-200 bg-white/70 px-5 py-1.5 text-sm font-black text-[#4F8FEA]">
            {stepIndex + 1} / {TOTAL_STEPS}
          </span>
        </div>
      </form>
    </SurveyLayout>
  );
}

type InputQuestionProps = {
  stepId: SurveyStepId;
  label: string;
  placeholder: string;
  value: string;
  helperText: string;
  onChange: (value: string) => void;
};

function InputQuestion({
  stepId,
  label,
  placeholder,
  value,
  helperText,
  onChange,
}: InputQuestionProps) {
  const inputId = `survey-${stepId}`;
  const Icon = stepId === "phone" ? Phone : User;

  return (
    <div className="rounded-[28px] bg-white/95 p-5 shadow-soft">
      <label htmlFor={inputId} className="text-lg font-black text-[#286BC8]">
        {label}
      </label>
      <div className="relative mt-4">
        <Icon
          className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400"
          aria-hidden="true"
        />
        <input
          id={inputId}
          type="text"
          autoComplete={stepId === "phone" ? "tel" : "name"}
          inputMode={stepId === "phone" ? "numeric" : "text"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="min-h-16 w-full rounded-[22px] border-2 border-slate-200 bg-white pl-12 pr-4 text-xl font-bold text-[#101D2E] placeholder:text-slate-400"
        />
      </div>
      <p className="mt-4 flex items-center justify-center gap-2 text-sm font-bold leading-relaxed text-slate-500">
        <LockKeyhole className="size-4" aria-hidden="true" />
        {helperText}
      </p>
    </div>
  );
}

type SingleChoiceQuestionProps = {
  stepId: SurveyStepId;
  answers: SurveyAnswers;
  onSelect: (value: "O" | "X") => void;
};

function SingleChoiceQuestion({ stepId, answers, onSelect }: SingleChoiceQuestionProps) {
  const step = SURVEY_STEPS.find((surveyStep) => surveyStep.id === stepId);
  const selectedValue = answers[stepId];
  const useTiles = stepId === "inconvenience" || stepId === "willingness";

  if (!step?.choices) {
    return null;
  }

  return (
    <div className={useTiles ? "grid grid-cols-2 gap-4" : "space-y-4"}>
      {step.choices.map((choice) => (
        <ChoiceButton
          key={choice.value}
          choice={choice}
          selected={selectedValue === choice.value}
          layout={useTiles ? "tile" : "list"}
          onClick={() => onSelect(choice.value as "O" | "X")}
        />
      ))}
    </div>
  );
}

type InfoPanelProps = {
  stepId: SurveyStepId;
  helperText: string;
};

function InfoPanel({ stepId, helperText }: InfoPanelProps) {
  if (stepId === "inconvenience") {
    return (
      <div className="rounded-[24px] border border-[#CFE4FF] bg-[#F1F7FF] p-4 shadow-sm">
        <p className="flex items-center gap-2 text-base font-black text-[#4F8FEA]">
          <Lightbulb className="size-6" aria-hidden="true" />
          예: 급여 스트레스, 먹이 거부, 복용 불편
        </p>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs font-bold text-[#101D2E]">
          {["급여 스트레스", "먹이 거부", "복용 불편"].map((label) => (
            <div key={label} className="rounded-2xl bg-white/80 px-2 py-3">
              <span className="mx-auto mb-2 grid size-9 place-items-center rounded-full bg-[#E7F3FF] text-[#286BC8]">
                <Info className="size-5" aria-hidden="true" />
              </span>
              {label}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (stepId === "willingness") {
    return (
      <div className="flex items-center gap-4 rounded-[24px] border border-[#CFE4FF] bg-[#F1F7FF] p-4 text-base font-bold leading-relaxed text-[#173B67] shadow-sm">
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#4F8FEA] text-white">
          <Info className="size-6" aria-hidden="true" />
        </span>
        <span>{helperText}</span>
        <Pipette className="ml-auto size-12 shrink-0 text-[#286BC8]" aria-hidden="true" />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 rounded-[22px] bg-white/85 px-4 py-4 text-sm font-bold leading-relaxed text-slate-700 shadow-sm">
      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#4F8FEA] text-white">
        {stepId === "currentUse" ? (
          <Lightbulb className="size-5" aria-hidden="true" />
        ) : stepId === "reasons" ? (
          <Check className="size-5" strokeWidth={3} aria-hidden="true" />
        ) : (
          <ShieldCheck className="size-5" aria-hidden="true" />
        )}
      </span>
      <span>{helperText}</span>
    </div>
  );
}

function PetPeek() {
  return (
    <div className="flex items-end justify-center gap-4 pt-1" aria-hidden="true">
      <span className="text-6xl leading-none drop-shadow-sm">🐶</span>
      <span className="text-6xl leading-none drop-shadow-sm">🐱</span>
      <Clock3 className="mb-2 size-7 text-[#4F8FEA]" />
    </div>
  );
}
