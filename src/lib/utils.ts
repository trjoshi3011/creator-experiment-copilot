import { type ClassValue, clsx } from "clsx";
import {
  ThemeExtractionResponse,
  ExperimentGenerationResponse,
  SetupSubmission as SetupSubmissionSchema,
} from "./schemas";
import type {
  SetupSubmission,
  ThemeCluster,
  Experiment,
  ThemeExtractionResponse as ThemeExtractionResponseType,
  ExperimentGenerationResponse as ExperimentGenerationResponseType,
} from "./types";

const STORAGE_KEY = "creator-experiment-input";
const THEMES_STORAGE_KEY = "creator-experiment-generated-themes";
const EXPERIMENTS_STORAGE_KEY = "creator-experiment-generated-experiments";

export function clearAllSavedData(): void {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(THEMES_STORAGE_KEY);
  localStorage.removeItem(EXPERIMENTS_STORAGE_KEY);
}

export function saveCreatorExperimentInput(input: SetupSubmission): void {
  localStorage.removeItem(THEMES_STORAGE_KEY);
  localStorage.removeItem(EXPERIMENTS_STORAGE_KEY);
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

export function getSetupSubmissionFingerprint(input: SetupSubmission): string {
  return JSON.stringify({
    creatorProfile: input.creatorProfile,
    commentInput: input.commentInput,
  });
}

export function saveGeneratedThemes(params: {
  inputFingerprint: string;
  themes: ThemeCluster[];
}): void {
  localStorage.setItem(
    THEMES_STORAGE_KEY,
    JSON.stringify({
      inputFingerprint: params.inputFingerprint,
      themes: params.themes,
      createdAt: new Date().toISOString(),
    }),
  );
}

export function loadGeneratedThemes(
  inputFingerprint: string,
): ThemeCluster[] | null {
  try {
    const raw = localStorage.getItem(THEMES_STORAGE_KEY);
    if (!raw) return null;
    const stored = JSON.parse(raw);
    if (stored.inputFingerprint !== inputFingerprint) return null;
    const result = ThemeExtractionResponse.safeParse({ themes: stored.themes });
    return result.success ? result.data.themes : null;
  } catch {
    return null;
  }
}

export function saveGeneratedExperiments(params: {
  inputFingerprint: string;
  experiments: Experiment[];
}): void {
  localStorage.setItem(
    EXPERIMENTS_STORAGE_KEY,
    JSON.stringify({
      inputFingerprint: params.inputFingerprint,
      experiments: params.experiments,
      createdAt: new Date().toISOString(),
    }),
  );
}

export function loadGeneratedExperiments(
  inputFingerprint: string,
): Experiment[] | null {
  try {
    const raw = localStorage.getItem(EXPERIMENTS_STORAGE_KEY);
    if (!raw) return null;
    const stored = JSON.parse(raw);
    if (stored.inputFingerprint !== inputFingerprint) return null;
    const result = ExperimentGenerationResponse.safeParse({
      experiments: stored.experiments,
    });
    return result.success ? result.data.experiments : null;
  } catch {
    return null;
  }
}

export function clearGeneratedExperiments(inputFingerprint?: string): void {
  if (!inputFingerprint) {
    localStorage.removeItem(EXPERIMENTS_STORAGE_KEY);
    return;
  }
  try {
    const raw = localStorage.getItem(EXPERIMENTS_STORAGE_KEY);
    if (!raw) return;
    const stored = JSON.parse(raw);
    if (stored.inputFingerprint === inputFingerprint) {
      localStorage.removeItem(EXPERIMENTS_STORAGE_KEY);
    }
  } catch {
    localStorage.removeItem(EXPERIMENTS_STORAGE_KEY);
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
