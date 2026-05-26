"use client";

import Image from "next/image";
import { FormEvent, ReactNode, useMemo, useState } from "react";
import {
  ArrowRight,
  Clock3,
  LockKeyhole,
  Phone,
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
  const [hasStarted, setHasStarted] = useState(false);
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

  function updateSingleAnswer(stepId: SurveyStepId, value: "O" | "X") {
    if (stepId === "currentUse") {
      updateAnswer("currentUse", value);
    }

    if (stepId === "inconvenience") {
      updateAnswer("inconvenience", value);
    }

    if (stepId === "willingness") {
      updateAnswer("willingness", value);
    }
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
      setSubmitError("제출에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function resetSurvey() {
    setAnswers(INITIAL_SURVEY_ANSWERS);
    setStepIndex(0);
    setSubmitError("");
    setIsCompleted(false);
    setHasStarted(false);
  }

  if (!hasStarted) {
    return <IntroScreen onStart={() => setHasStarted(true)} />;
  }

  if (isCompleted) {
    return <CompletionScreen onReset={resetSurvey} />;
  }

  return (
    <SurveyLayout
      progress={currentStep.progress}
      stepNumber={stepIndex + 1}
      totalSteps={TOTAL_STEPS}
      showBack={stepIndex > 0}
      onBack={goBack}
    >
      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
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
            onSelect={(value) => updateSingleAnswer(currentStep.id, value)}
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
          className="flex min-h-16 w-full items-center justify-center gap-5 rounded-[22px] bg-[#67A8F2] px-6 text-xl font-black text-white shadow-button transition enabled:hover:-translate-y-0.5 enabled:active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-45"
        >
          <span>{isSubmitting ? "제출 중..." : currentStep.cta ?? "다음"}</span>
          <ArrowRight className="size-7" aria-hidden="true" />
        </button>
      </form>
    </SurveyLayout>
  );
}

type IntroScreenProps = {
  onStart: () => void;
};

function IntroScreen({ onStart }: IntroScreenProps) {
  return (
    <SurveyLayout progress={10} title="우리 아이 구충제, 어떻게 사용하고 계신가요?">
      <section className="mt-10 space-y-5">
        <GuideBubble>
          <span>안녕하세요, 웰케어입니다 :)</span>
          <span>반려동물 올인원 구충제 사용 경험에 대한 간단한 설문입니다.</span>
          <span>응답해주신 내용은 제품 및 시장 조사 목적으로만 활용됩니다.</span>
          <span>※ 작성해주신 개인정보는 응답 확인 및 안내 목적으로만 사용됩니다.</span>
        </GuideBubble>

        <GuideBubble compact trailingIcon={<Clock3 className="size-6 text-[#67A8F2]" />}>
          <span>약 1분 정도 걸려요.</span>
        </GuideBubble>

        <div className="mx-auto max-w-[320px] pt-8">
          <Image
            src="/images/welcare-pets.png"
            alt="하얀 강아지와 크림색 고양이"
            width={620}
            height={310}
            priority
            className="h-auto w-full rounded-[20px] object-contain"
          />
        </div>

        <button
          type="button"
          onClick={onStart}
          className="flex min-h-16 w-full items-center justify-center gap-8 rounded-[22px] bg-[#67A8F2] px-6 text-xl font-black text-white shadow-button transition hover:-translate-y-0.5 active:translate-y-0"
        >
          <span>설문 시작하기</span>
          <ArrowRight className="size-7" aria-hidden="true" />
        </button>
      </section>
    </SurveyLayout>
  );
}

type GuideBubbleProps = {
  children: ReactNode;
  compact?: boolean;
  trailingIcon?: ReactNode;
};

function GuideBubble({ children, compact = false, trailingIcon }: GuideBubbleProps) {
  return (
    <div className="flex gap-3">
      <div className="mt-2 grid size-12 shrink-0 place-items-center overflow-hidden rounded-full bg-[#E8F4FF]">
        <Image
          src="/images/insectal-avatar.png"
          alt=""
          width={48}
          height={48}
          className="size-full object-cover"
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="mb-2 text-xs font-extrabold text-[#67A9FF]">인섹탈 가이드</div>
        <div
          className={[
            "flex items-center gap-5 rounded-[24px] border border-[#E7EEF7] bg-white px-5 text-[#101D2E] shadow-soft",
            compact ? "min-h-14 py-3 text-base font-extrabold" : "min-h-32 py-5 text-base font-semibold leading-loose",
          ].join(" ")}
        >
          <div className={compact ? "" : "flex flex-col"}>{children}</div>
          {trailingIcon ? <span className="ml-auto shrink-0">{trailingIcon}</span> : null}
        </div>
      </div>
    </div>
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
    <div className="rounded-[24px] border border-[#E7EEF7] bg-white p-5 shadow-soft">
      <label htmlFor={inputId} className="text-base font-black text-[#4D8CDC]">
        {label}
      </label>
      <div className="relative mt-4">
        <Icon
          className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#9AA8B6]"
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
          className="min-h-14 w-full rounded-[18px] border-2 border-[#E4ECF5] bg-white pl-12 pr-4 text-lg font-bold text-[#101D2E] placeholder:text-[#AAB6C2]"
        />
      </div>
      <p className="mt-4 flex items-center justify-center gap-2 text-xs font-bold leading-relaxed text-[#6B7B8B]">
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
    <div className={useTiles ? "grid grid-cols-2 gap-3" : "space-y-3"}>
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

function PetPeek() {
  return (
    <div className="mx-auto max-w-[220px] pt-1" aria-hidden="true">
      <Image
        src="/images/welcare-pets.png"
        alt=""
        width={360}
        height={180}
        className="h-auto w-full rounded-[18px] object-contain"
      />
    </div>
  );
}
