import type { BinaryAnswer, SurveyAnswers, SurveyStep, SurveyStepId } from "@/types/survey";

export const SEX_OPTIONS = ["수컷", "암컷"] as const;

export const AGE_RANGE_OPTIONS = ["1살 미만", "1살 이상 7살 미만", "7살 이상"] as const;

export const REASON_OPTIONS = [
  "유명해서",
  "바르는 제품이 없어서",
  "동물병원장님의 추천",
  "잘 먹어서",
] as const;

export const INITIAL_SURVEY_ANSWERS: SurveyAnswers = {
  sex: "",
  ageRange: "",
  currentUse: "",
  reasons: [],
  inconvenience: "",
  willingness: "",
};

export const SURVEY_STEPS: SurveyStep[] = [
  {
    id: "sex",
    progress: 20,
    question: "1. 아이의 성별을 선택해주세요.",
    kind: "single",
    helperText: "성별을 선택해주세요.",
    choices: SEX_OPTIONS.map((sex) => ({
      value: sex,
      label: sex,
      formValue: sex,
      icon: "check",
    })),
  },
  {
    id: "ageRange",
    progress: 35,
    question: "2. 아이의 연령대를 선택해주세요.",
    kind: "single",
    helperText: "연령대를 선택해주세요.",
    choices: AGE_RANGE_OPTIONS.map((ageRange) => ({
      value: ageRange,
      label: ageRange,
      formValue: ageRange,
      icon: "check",
    })),
  },
  {
    id: "currentUse",
    progress: 50,
    question: "3. 현재 기존의 먹이는 올인원 구충제를 사용중이신가요?",
    kind: "single",
    helperText: "O 또는 X로 답변해주세요.",
    choices: [
      { value: "O", label: "O", formValue: "O", icon: "o" },
      { value: "X", label: "X", formValue: "X", icon: "x" },
    ],
  },
  {
    id: "reasons",
    progress: 65,
    question: "4. 먹이는 올인원 제품을 사용하는 이유는 무엇인가요?",
    subtitle: "(여러개 선택 가능)",
    kind: "multi",
    helperText: "(여러개 선택 가능)",
    choices: REASON_OPTIONS.map((reason) => ({
      value: reason,
      label: reason,
      formValue: reason,
      icon: "check",
    })),
  },
  {
    id: "inconvenience",
    progress: 80,
    question: "5. 먹이는 올인원 제품 사용 시 불편하거나 문제점이 있으신가요?",
    kind: "single",
    helperText: "O 또는 X로 답변해주세요.",
    choices: [
      { value: "O", label: "O", formValue: "O", icon: "o" },
      { value: "X", label: "X", formValue: "X", icon: "x" },
    ],
  },
  {
    id: "willingness",
    progress: 95,
    question: "6. 피부 자극 없는 바르는 올인원 구충제, 인섹탈이 출시되었습니다^^ 사용해보실 의향이 있으신가요?",
    kind: "single",
    helperText: "O 또는 X로 답변해주세요.",
    cta: "제출하기",
    choices: [
      { value: "O", label: "O", formValue: "O", icon: "o" },
      { value: "X", label: "X", formValue: "X", icon: "x" },
    ],
  },
];

export function isBinaryAnswer(value: unknown): value is Exclude<BinaryAnswer, ""> {
  return value === "O" || value === "X";
}

export function validateStepAnswer(stepId: SurveyStepId, answers: SurveyAnswers) {
  switch (stepId) {
    case "sex":
      return SEX_OPTIONS.includes(answers.sex as (typeof SEX_OPTIONS)[number]);
    case "ageRange":
      return AGE_RANGE_OPTIONS.includes(answers.ageRange as (typeof AGE_RANGE_OPTIONS)[number]);
    case "currentUse":
      return isBinaryAnswer(answers.currentUse);
    case "reasons":
      return answers.reasons.length > 0;
    case "inconvenience":
      return isBinaryAnswer(answers.inconvenience);
    case "willingness":
      return isBinaryAnswer(answers.willingness);
    default:
      return false;
  }
}

export function validateAllAnswers(answers: SurveyAnswers) {
  const errors: Partial<Record<SurveyStepId, string>> = {};

  for (const step of SURVEY_STEPS) {
    if (!validateStepAnswer(step.id, answers)) {
      errors[step.id] = "필수 응답이 누락되었습니다.";
    }
  }

  return {
    ok: Object.keys(errors).length === 0,
    errors,
  };
}

export function toSurveyAnswers(body: unknown): SurveyAnswers {
  const source = typeof body === "object" && body !== null ? body : {};
  const record = source as Record<string, unknown>;

  return {
    sex: typeof record.sex === "string" ? record.sex : "",
    ageRange: typeof record.ageRange === "string" ? record.ageRange : "",
    currentUse: isBinaryAnswer(record.currentUse) ? record.currentUse : "",
    reasons: Array.isArray(record.reasons)
      ? record.reasons.filter((reason): reason is string => typeof reason === "string")
      : [],
    inconvenience: isBinaryAnswer(record.inconvenience) ? record.inconvenience : "",
    willingness: isBinaryAnswer(record.willingness) ? record.willingness : "",
  };
}
