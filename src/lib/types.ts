import type { z } from "zod";
import type {
  CreatorProfile,
  CommentInput,
  ThemeCluster,
  ExperimentScorecard,
  Experiment,
  OpportunityType,
  ThemeExtractionResponse,
  ExperimentGenerationResponse,
  SetupSubmission,
} from "./schemas";

export type CreatorProfile = z.infer<typeof CreatorProfile>;
export type CommentInput = z.infer<typeof CommentInput>;
export type ThemeCluster = z.infer<typeof ThemeCluster>;
export type ExperimentScorecard = z.infer<typeof ExperimentScorecard>;
export type Experiment = z.infer<typeof Experiment>;
export type OpportunityType = z.infer<typeof OpportunityType>;
export type ThemeExtractionResponse = z.infer<typeof ThemeExtractionResponse>;
export type ExperimentGenerationResponse = z.infer<typeof ExperimentGenerationResponse>;
export type SetupSubmission = z.infer<typeof SetupSubmission>;
