import type { BinaryAnswer, SurveyAnswers, SurveyStep, SurveyStepId } from "@/types/survey";

export const REASON_OPTIONS = [
  "유명해서",
  "바르는 제품이 없어서",
  "동물병원장님의 추천",
  "잘 먹어서",
] as const;

export const INITIAL_SURVEY_ANSWERS: SurveyAnswers = {
  name: "",
  phone: "",
  currentUse: "",
  reasons: [],
  inconvenience: "",
  willingness: "",
};

export const SURVEY_STEPS: SurveyStep[] = [
  {
    id: "name",
    progress: 20,
    question: "1. 성함을 입력해주세요.",
    kind: "text",
    fieldLabel: "성함",
    placeholder: "성함을 입력해주세요",
    helperText: "※ 작성해주신 개인정보는 응답 확인 및 안내 목적으로만 사용됩니다.",
  },
  {
    id: "phone",
    progress: 35,
    question: "2. 휴대폰 번호를 입력해주세요.",
    kind: "phone",
    fieldLabel: "휴대폰 번호",
    placeholder: "010-0000-0000",
    helperText: "※ 작성해주신 개인정보는 응답 확인 및 안내 목적으로만 사용됩니다.",
  },
  {
    id: "currentUse",
    progress: 50,
    question: "3. 현재 기존의 올인원 구충제를 사용 중이신가요?",
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
    question: "6. 바르는 형태의 올인원 제품이 출시된다면 사용해보실 의향이 있으신가요?",
    kind: "single",
    helperText: "O 또는 X로 답변해주세요.",
    cta: "제출하기",
    choices: [
      { value: "O", label: "O", formValue: "O", icon: "o" },
      { value: "X", label: "X", formValue: "X", icon: "x" },
    ],
  },
];

export function getPhoneDigits(phone: string) {
  return phone.replace(/\D/g, "");
}

export function formatPhoneNumber(value: string) {
  const digits = getPhoneDigits(value).slice(0, 11);

  if (digits.length <= 3) {
    return digits;
  }

  if (digits.length <= 7) {
    return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  }

  if (digits.length === 10) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  }

  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
}

export function isBinaryAnswer(value: unknown): value is Exclude<BinaryAnswer, ""> {
  return value === "O" || value === "X";
}

export function validateStepAnswer(stepId: SurveyStepId, answers: SurveyAnswers) {
  switch (stepId) {
    case "name":
      return answers.name.trim().length >= 1;
    case "phone":
      return getPhoneDigits(answers.phone).length >= 10 && getPhoneDigits(answers.phone).length <= 11;
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
    name: typeof record.name === "string" ? record.name : "",
    phone: typeof record.phone === "string" ? record.phone : "",
    currentUse: isBinaryAnswer(record.currentUse) ? record.currentUse : "",
    reasons: Array.isArray(record.reasons)
      ? record.reasons.filter((reason): reason is string => typeof reason === "string")
      : [],
    inconvenience: isBinaryAnswer(record.inconvenience) ? record.inconvenience : "",
    willingness: isBinaryAnswer(record.willingness) ? record.willingness : "",
  };
}
