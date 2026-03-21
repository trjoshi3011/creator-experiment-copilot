import { ExperimentGenerationResponse as ExperimentGenerationResponseSchema } from "./schemas";
import type {
  CreatorProfile,
  ThemeCluster,
  Experiment,
  ExperimentScorecard,
} from "./types";

const MAX_EXPERIMENTS = 5;

interface ExperimentTemplate {
  titleSuffix: string;
  concept: string;
  hook: string;
  format: string;
  rationale: string;
  scores: Omit<ExperimentScorecard, "priorityScore" | "explanation">;
  explanationHint: string;
}

type TemplatesByOpportunity = Record<string, ExperimentTemplate[]>;

const templates: TemplatesByOpportunity = {
  question: [
    {
      titleSuffix: "— the absolute beginner's guide",
      concept:
        "A short explainer that strips the topic down to first principles so a total beginner can follow along in under 60 seconds.",
      hook: "You keep hearing about this but nobody explains it simply. Here's the 60-second version.",
      format: "45–60s talking-head with on-screen text highlights",
      rationale:
        "Beginner content has a wide top-of-funnel reach and converts curious viewers into followers.",
      scores: { audienceAppeal: 5, riskLevel: 1, novelty: 2, clarity: 5, audienceFit: 5 },
      explanationHint: "High appeal and clarity with very low risk — a reliable audience builder.",
    },
    {
      titleSuffix: "— start here if you're overwhelmed",
      concept:
        "A 'choose your own path' style video that gives the viewer 2–3 clear starting points based on their situation.",
      hook: "Feeling overwhelmed? Pick one of these three paths and ignore everything else.",
      format: "60s voice-over with branching graphic overlay",
      rationale:
        "Decision fatigue is a real barrier. Giving a simple decision tree earns trust and saves.",
      scores: { audienceAppeal: 4, riskLevel: 1, novelty: 3, clarity: 5, audienceFit: 4 },
      explanationHint: "Clear structure with moderate novelty — helpful and low risk.",
    },
  ],
  request: [
    {
      titleSuffix: "— the deep dive (part 2)",
      concept:
        "A follow-up video that goes deeper on the most-requested subtopic, with concrete examples and a downloadable resource.",
      hook: "You asked for part 2. Here it is — with examples nobody else is showing.",
      format: "90s screen-share walkthrough with template reveal",
      rationale:
        "Follow-up content shows responsiveness and rewards engaged viewers, boosting loyalty.",
      scores: { audienceAppeal: 4, riskLevel: 2, novelty: 3, clarity: 4, audienceFit: 5 },
      explanationHint: "Strong audience fit since viewers explicitly asked. Moderate novelty.",
    },
    {
      titleSuffix: "— 3 real examples you can copy",
      concept:
        "Walk through three concrete, copy-paste examples that show the concept in action for different scenarios.",
      hook: "Stop saving posts. Here are 3 examples you can literally copy today.",
      format: "60s split-screen: before/after examples",
      rationale:
        "Actionable examples convert passive viewers into active followers who try your advice.",
      scores: { audienceAppeal: 5, riskLevel: 1, novelty: 2, clarity: 5, audienceFit: 4 },
      explanationHint: "Very actionable with high clarity — low-risk, high-reward content.",
    },
  ],
  objection: [
    {
      titleSuffix: "— the honest truth about why it doesn't work for everyone",
      concept:
        "Address the top 2–3 objections head-on, acknowledge the limits, and offer alternative approaches for edge cases.",
      hook: "This advice doesn't work for everyone. Here's what to do instead.",
      format: "60s talking-head with myth/fact text overlays",
      rationale:
        "Acknowledging objections builds credibility and differentiates from creators who ignore pushback.",
      scores: { audienceAppeal: 4, riskLevel: 3, novelty: 4, clarity: 4, audienceFit: 5 },
      explanationHint: "Moderate risk from a contrarian angle, but high credibility payoff.",
    },
    {
      titleSuffix: "— the budget/time-crunched version",
      concept:
        "A stripped-down, constraint-friendly version of the original advice designed for people with limited time or money.",
      hook: "No time? No budget? Here's the version nobody talks about.",
      format: "45s casual vlog-style with checklist overlay",
      rationale:
        "Constraint-specific content reaches underserved segments and signals empathy.",
      scores: { audienceAppeal: 4, riskLevel: 2, novelty: 3, clarity: 5, audienceFit: 4 },
      explanationHint: "Practical and empathetic. Clarity is high because of the simple format.",
    },
  ],
  _default: [
    {
      titleSuffix: "— what your audience is really asking for",
      concept:
        "Synthesize the general sentiment into a single, focused video that addresses the core curiosity.",
      hook: "I read every single comment. Here's what you actually want to know.",
      format: "60s talking-head with comment screenshots",
      rationale:
        "Meta-content about audience questions makes viewers feel heard and drives comment engagement.",
      scores: { audienceAppeal: 4, riskLevel: 2, novelty: 3, clarity: 4, audienceFit: 4 },
      explanationHint: "Solid all-around scores. Safe bet for engagement without high risk.",
    },
  ],
};

function computePriorityScore(
  scores: Omit<ExperimentScorecard, "priorityScore" | "explanation">,
  demandSignal: number,
): number {
  const weighted =
    scores.audienceAppeal * 0.25 +
    scores.audienceFit * 0.2 +
    scores.clarity * 0.15 +
    scores.novelty * 0.15 +
    (6 - scores.riskLevel) * 0.1 + // invert: lower risk = higher contribution
    demandSignal * 0.15;

  return Math.round(weighted * 20) / 10; // scale to ~1–10 range, one decimal
}

function buildExperiment(
  id: string,
  theme: ThemeCluster,
  template: ExperimentTemplate,
  _creatorProfile: CreatorProfile,
): Experiment {
  const priorityScore = computePriorityScore(template.scores, theme.demandSignal);

  return {
    id,
    sourceThemeId: theme.id,
    title: `${theme.title} ${template.titleSuffix}`,
    concept: template.concept,
    hook: template.hook,
    format: template.format,
    rationale: template.rationale,
    scorecard: {
      ...template.scores,
      priorityScore,
      explanation: template.explanationHint,
    },
  };
}

function getTemplatesForTheme(theme: ThemeCluster): ExperimentTemplate[] {
  return templates[theme.opportunityType] ?? templates._default;
}

export function generateExperimentsFromThemes(params: {
  creatorProfile: CreatorProfile;
  themes: ThemeCluster[];
}): Experiment[] {
  const { creatorProfile, themes } = params;
  const experiments: Experiment[] = [];
  let idCounter = 1;

  for (const theme of themes) {
    if (experiments.length >= MAX_EXPERIMENTS) break;

    const available = getTemplatesForTheme(theme);
    const toGenerate = Math.min(2, MAX_EXPERIMENTS - experiments.length, available.length);

    for (let i = 0; i < toGenerate; i++) {
      experiments.push(
        buildExperiment(`exp-${idCounter}`, theme, available[i], creatorProfile),
      );
      idCounter++;
    }
  }

  experiments.sort((a, b) => b.scorecard.priorityScore - a.scorecard.priorityScore);

  const result = ExperimentGenerationResponseSchema.safeParse({ experiments });
  if (!result.success) return [];

  return result.data.experiments;
}
