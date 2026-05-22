import { NextResponse } from "next/server";
import { GoogleFormConfigurationError, submitToGoogleForm } from "@/lib/googleForm";
import { toSurveyAnswers, validateAllAnswers } from "@/lib/survey";

export async function POST(req: Request) {
  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON request body." },
      { status: 400 },
    );
  }

  const answers = toSurveyAnswers(body);
  const validation = validateAllAnswers(answers);

  if (!validation.ok) {
    return NextResponse.json(
      { ok: false, error: "Required survey answers are missing.", details: validation.errors },
      { status: 400 },
    );
  }

  try {
    await submitToGoogleForm(answers);
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof GoogleFormConfigurationError) {
      console.error(error.message);

      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 },
      );
    }

    console.error("Failed to submit Google Form response.", error);

    return NextResponse.json(
      { ok: false, error: "Failed to submit Google Form response." },
      { status: 502 },
    );
  }
}
