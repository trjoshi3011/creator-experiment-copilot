import { z } from "zod";

export const OpportunityType = z.enum([
  "question",
  "confusion",
  "request",
  "objection",
  "emotion",
  "adjacent_topic",
]);

export const CreatorProfile = z.object({
  niche: z.string(),
  audienceDemographic: z.string(),
  audienceInterests: z.array(z.string()),
  contentPillars: z.array(z.string()),
  recentTopics: z.array(z.string()),
  tone: z.string(),
});

export const CommentInput = z.object({
  comments: z.array(z.string()),
  postCaption: z.string().optional(),
  postTopic: z.string().optional(),
});

export const ThemeCluster = z.object({
  id: z.string(),
  title: z.string(),
  summary: z.string(),
  representativeComments: z.array(z.string()),
  demandSignal: z.number().int().min(1).max(5),
  opportunityType: OpportunityType,
});

export const ExperimentScorecard = z.object({
  audienceAppeal: z.number().int().min(1).max(5),
  riskLevel: z.number().int().min(1).max(5),
  novelty: z.number().int().min(1).max(5),
  clarity: z.number().int().min(1).max(5),
  audienceFit: z.number().int().min(1).max(5),
  priorityScore: z.number(),
  explanation: z.string(),
});

export const Experiment = z.object({
  id: z.string(),
  sourceThemeId: z.string(),
  title: z.string(),
  concept: z.string(),
  hook: z.string(),
  format: z.string(),
  rationale: z.string(),
  scorecard: ExperimentScorecard,
});

export const ThemeExtractionResponse = z.object({
  themes: z.array(ThemeCluster),
});

export const ExperimentGenerationResponse = z.object({
  experiments: z.array(Experiment),
});

export const SetupSubmission = z.object({
  creatorProfile: CreatorProfile,
  commentInput: CommentInput,
});
