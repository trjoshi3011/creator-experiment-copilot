import { type ClassValue, clsx } from "clsx";
import {
  ThemeExtractionResponse,
  ExperimentGenerationResponse,
  SetupSubmission as SetupSubmissionSchema,
} from "./schemas";
import type {
  SetupSubmission,
  ThemeExtractionResponse as ThemeExtractionResponseType,
  ExperimentGenerationResponse as ExperimentGenerationResponseType,
} from "./types";

const STORAGE_KEY = "creator-experiment-input";

export function saveCreatorExperimentInput(input: SetupSubmission): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(input));
}

export function loadCreatorExperimentInput(): SetupSubmission | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const result = SetupSubmissionSchema.safeParse(JSON.parse(raw));
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

export function validateThemeExtractionResponse(input: unknown):
  | { success: true; data: ThemeExtractionResponseType }
  | { success: false; error: string } {
  const result = ThemeExtractionResponse.safeParse(input);
  if (result.success) return { success: true, data: result.data };
  return { success: false, error: result.error.message };
}

export function validateExperimentGenerationResponse(input: unknown):
  | { success: true; data: ExperimentGenerationResponseType }
  | { success: false; error: string } {
  const result = ExperimentGenerationResponse.safeParse(input);
  if (result.success) return { success: true, data: result.data };
  return { success: false, error: result.error.message };
}
