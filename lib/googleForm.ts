import type { SurveyAnswers } from "@/types/survey";

const GOOGLE_FORM_ENV_KEYS = [
  "GOOGLE_FORM_ACTION_URL",
  "GOOGLE_FORM_ENTRY_SEX",
  "GOOGLE_FORM_ENTRY_AGE_RANGE",
  "GOOGLE_FORM_ENTRY_CURRENT_USE",
  "GOOGLE_FORM_ENTRY_REASON",
  "GOOGLE_FORM_ENTRY_INCONVENIENCE",
  "GOOGLE_FORM_ENTRY_WILLINGNESS",
] as const;

type GoogleFormEnvKey = (typeof GOOGLE_FORM_ENV_KEYS)[number];

type GoogleFormConfig = Record<GoogleFormEnvKey, string>;

export class GoogleFormConfigurationError extends Error {
  constructor(missingKeys: string[]) {
    super(`Google Form environment variables are missing or still placeholders: ${missingKeys.join(", ")}`);
    this.name = "GoogleFormConfigurationError";
  }
}

function isConfiguredValue(key: GoogleFormEnvKey, value: string | undefined) {
  if (!value) {
    return false;
  }

  if (key === "GOOGLE_FORM_ACTION_URL") {
    return value.startsWith("https://docs.google.com/forms/") && !value.includes("FORM_ID");
  }

  return value.startsWith("entry.") && !value.includes("xxxxxxxxxx");
}

function getGoogleFormConfig(): GoogleFormConfig {
  const missingKeys = GOOGLE_FORM_ENV_KEYS.filter((key) => !isConfiguredValue(key, process.env[key]));

  if (missingKeys.length > 0) {
    throw new GoogleFormConfigurationError(missingKeys);
  }

  return GOOGLE_FORM_ENV_KEYS.reduce((config, key) => {
    config[key] = process.env[key] as string;
    return config;
  }, {} as GoogleFormConfig);
}

export async function submitToGoogleForm(answers: SurveyAnswers) {
  const config = getGoogleFormConfig();
  const formData = new URLSearchParams();

  formData.append(config.GOOGLE_FORM_ENTRY_SEX, answers.sex);
  formData.append(config.GOOGLE_FORM_ENTRY_AGE_RANGE, answers.ageRange);
  formData.append(config.GOOGLE_FORM_ENTRY_CURRENT_USE, answers.currentUse);
  formData.append(config.GOOGLE_FORM_ENTRY_INCONVENIENCE, answers.inconvenience);
  formData.append(config.GOOGLE_FORM_ENTRY_WILLINGNESS, answers.willingness);

  for (const reason of answers.reasons) {
    formData.append(config.GOOGLE_FORM_ENTRY_REASON, reason);
  }

  const response = await fetch(config.GOOGLE_FORM_ACTION_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData.toString(),
    redirect: "follow",
  });

  if (response.status >= 200 && response.status < 400) {
    return;
  }

  throw new Error(`Google Form responded with status ${response.status}`);
}
