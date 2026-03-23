import { NextResponse } from "next/server";
import {
  ExperimentGenerationRequest as ExperimentGenerationRequestSchema,
  ExperimentGenerationResponse as ExperimentGenerationResponseSchema,
} from "@/lib/schemas";
import { buildExperimentGenerationPrompt } from "@/lib/prompts";

const GEMINI_MODEL = "gemini-3-flash-preview";

async function callGemini(prompt: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set");

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.5,
        },
      }),
    },
  );

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Gemini API error ${res.status}: ${body}`);
  }

  const data = await res.json();
  const text: string | undefined =
    data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) throw new Error("Empty response from Gemini API");

  return text;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const input = ExperimentGenerationRequestSchema.safeParse(body);
    if (!input.success) {
      return NextResponse.json(
        { error: "Invalid request body", details: input.error.message },
        { status: 400 },
      );
    }

    const { creatorProfile, themes } = input.data;

    const prompt = buildExperimentGenerationPrompt({
      niche: creatorProfile.niche,
      audienceDemographic: creatorProfile.audienceDemographic,
      audienceInterests: creatorProfile.audienceInterests,
      contentPillars: creatorProfile.contentPillars,
      recentTopics: creatorProfile.recentTopics,
      tone: creatorProfile.tone,
      themes,
    });

    const raw = await callGemini(prompt);

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      console.error("Failed to parse LLM response as JSON:", raw);
      return NextResponse.json(
        { error: "LLM returned invalid JSON", raw },
        { status: 500 },
      );
    }

    const validated = ExperimentGenerationResponseSchema.safeParse(parsed);
    if (!validated.success) {
      console.error(
        "LLM response failed schema validation:",
        validated.error.message,
      );
      return NextResponse.json(
        {
          error: "LLM response does not match expected schema",
          details: validated.error.message,
        },
        { status: 500 },
      );
    }

    return NextResponse.json(validated.data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("generate-experiments error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
