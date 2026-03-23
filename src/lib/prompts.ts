import type { ThemeCluster } from "./types";

interface ThemeExtractionPromptInput {
  niche: string;
  audienceDemographic: string;
  audienceInterests: string[];
  contentPillars: string[];
  recentTopics: string[];
  tone: string;
  postTopic?: string;
  postCaption?: string;
  comments: string[];
}

export function buildThemeExtractionPrompt(
  input: ThemeExtractionPromptInput,
): string {
  const numberedComments = input.comments
    .map((c, i) => `${i + 1}. ${c}`)
    .join("\n");

  return `You are an audience-analysis assistant for a short-form content creator.

## Creator context

- Niche: ${input.niche}
- Audience demographic: ${input.audienceDemographic}
- Audience interests: ${input.audienceInterests.join(", ")}
- Content pillars: ${input.contentPillars.join(", ")}
- Recent topics: ${input.recentTopics.join(", ")}
- Tone: ${input.tone}
${input.postTopic ? `- Post topic: ${input.postTopic}` : ""}
${input.postCaption ? `- Post caption: "${input.postCaption}"` : ""}

## Audience comments

${numberedComments}

## Task

Analyze the comments above and identify 3 to 5 high-value audience themes that represent distinct content opportunities for this creator.

Rules:
- Group repeated signals, questions, and sentiments into distinct clusters.
- Each theme must be clearly different from the others — do not create overlapping themes.
- Focus on themes that are actionable for a short-form content creator: what can they make a video about?
- Include 2 to 4 representative comments per theme, copied verbatim from the list above.
- Estimate a demandSignal from 1 (weak signal) to 5 (very strong signal) based on how many comments support the theme and how clearly the audience is asking for it.
- Choose exactly one opportunityType per theme from this enum: "question", "confusion", "request", "objection", "emotion", "adjacent_topic".

## Output format

Return JSON only. No markdown fences, no commentary, no explanation — just the JSON object.

{
  "themes": [
    {
      "id": "theme-1",
      "title": "Short readable theme label",
      "summary": "1-2 sentence summary of what the audience is asking for and why it matters.",
      "representativeComments": ["Exact comment text from above", "Another exact comment"],
      "demandSignal": 4,
      "opportunityType": "request"
    }
  ]
}

Use sequential ids: "theme-1", "theme-2", etc.
Return between 3 and 5 themes.
Do not return anything outside the JSON object.`;
}

interface ExperimentGenerationPromptInput {
  niche: string;
  audienceDemographic: string;
  audienceInterests: string[];
  contentPillars: string[];
  recentTopics: string[];
  tone: string;
  themes: ThemeCluster[];
}

export function buildExperimentGenerationPrompt(
  input: ExperimentGenerationPromptInput,
): string {
  const themesBlock = input.themes
    .map(
      (t) =>
        `[${t.id}] "${t.title}" | ${t.opportunityType} | demand ${t.demandSignal}/5 — ${t.summary}`,
    )
    .join("\n");

  return `You are a short-form video strategist. Generate experiment ideas from audience themes.

Creator: ${input.niche} creator for ${input.audienceDemographic}.
Interests: ${input.audienceInterests.join(", ")}
Pillars: ${input.contentPillars.join(", ")}
Recent: ${input.recentTopics.join(", ")}
Tone: ${input.tone}

Themes:
${themesBlock}

Generate 1–2 distinct video ideas per theme (max 5 total). Each must reference its sourceThemeId. No duplicate concepts.

Per experiment: title, concept (1–2 sentences), hook (first 2 seconds), format (e.g. "60s talking-head"), rationale (why it fits this creator).

Score each (integers 1–5): audienceAppeal, riskLevel, novelty, clarity, audienceFit.
Compute priorityScore (1–10, one decimal) weighted toward appeal, fit, clarity, demand. Lower risk helps.
Add a 1–2 sentence explanation.

Return JSON only — no markdown, no commentary.

{"experiments":[{"id":"exp-1","sourceThemeId":"theme-1","title":"...","concept":"...","hook":"...","format":"...","rationale":"...","scorecard":{"audienceAppeal":4,"riskLevel":2,"novelty":3,"clarity":5,"audienceFit":4,"priorityScore":7.8,"explanation":"..."}}]}

Sequential ids. Sort by priorityScore descending. Max 5.`;
}
