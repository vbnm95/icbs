export type BinaryAnswer = "O" | "X" | "";

export type SurveyAnswers = {
  name: string;
  phone: string;
  currentUse: BinaryAnswer;
  reasons: string[];
  inconvenience: BinaryAnswer;
  willingness: BinaryAnswer;
};

export type SurveyStepId =
  | "name"
  | "phone"
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
  kind: "text" | "phone" | "single" | "multi";
  fieldLabel?: string;
  placeholder?: string;
  helperText: string;
  choices?: SurveyChoice[];
  cta?: string;
};
