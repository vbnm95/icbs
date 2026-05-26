export type BinaryAnswer = "O" | "X" | "";

export type SurveyAnswers = {
  sex: string;
  ageRange: string;
  currentUse: BinaryAnswer;
  reasons: string[];
  inconvenience: BinaryAnswer;
  willingness: BinaryAnswer;
};

export type SurveyStepId =
  | "sex"
  | "ageRange"
  | "currentUse"
  | "reasons"
  | "inconvenience"
  | "willingness";

export type SurveyChoice = {
  value: string;
  label: string;
  formValue: string;
  icon: "o" | "x" | "check";
};

export type SurveyStep = {
  id: SurveyStepId;
  progress: number;
  question: string;
  subtitle?: string;
  kind: "single" | "multi";
  helperText: string;
  choices?: SurveyChoice[];
  cta?: string;
};
