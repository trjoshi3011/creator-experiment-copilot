"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  loadCreatorExperimentInput,
  loadGeneratedExperiments,
  loadGeneratedThemes,
  getSetupSubmissionFingerprint,
} from "@/lib/utils";
import type { Experiment, ThemeCluster } from "@/lib/types";

const scorecardFields = [
  { key: "audienceAppeal", label: "Audience Appeal" },
  { key: "riskLevel", label: "Risk Level" },
  { key: "novelty", label: "Novelty" },
  { key: "clarity", label: "Clarity" },
  { key: "audienceFit", label: "Audience Fit" },
] as const;

export default function ExperimentDetailView({ id }: { id: string }) {
  const router = useRouter();
  const [hasMounted, setHasMounted] = useState(false);
  const [experiment, setExperiment] = useState<Experiment | null>(null);
  const [sourceTheme, setSourceTheme] = useState<ThemeCluster | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!hasMounted) return;

    const input = loadCreatorExperimentInput();
    if (!input) {
      router.replace("/setup");
      return;
    }

    const fingerprint = getSetupSubmissionFingerprint(input);
    const cached = loadGeneratedExperiments(fingerprint);
    if (!cached) {
      router.replace("/studio");
      return;
    }

    const match = cached.find((e) => e.id === id);
    if (!match) {
      setNotFound(true);
      return;
    }

    setExperiment(match);

    const themes = loadGeneratedThemes(fingerprint);
    if (themes) {
      const theme = themes.find((t) => t.id === match.sourceThemeId);
      if (theme) setSourceTheme(theme);
    }
  }, [hasMounted, id, router]);

  if (!hasMounted) {
    return (
      <div className="mt-16 flex flex-col items-center py-12 text-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-border border-t-accent" />
        <p className="mt-4 text-sm font-medium">Loading&hellip;</p>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
        <p className="font-mono text-sm text-accent">404</p>
        <h1 className="mt-2 text-2xl font-semibold">Experiment not found</h1>
        <p className="mt-2 text-sm text-muted">
          No experiment with id &ldquo;{id}&rdquo;
        </p>
        <Link
          href="/studio"
          className="mt-6 rounded-full border border-border px-5 py-2 text-sm font-medium transition-colors hover:bg-surface-hover"
        >
          &larr; Back to Studio
        </Link>
      </div>
    );
  }

  if (!experiment) {
    return (
      <div className="mt-16 flex flex-col items-center py-12 text-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-border border-t-accent" />
        <p className="mt-4 text-sm font-medium">Loading&hellip;</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <Link
        href="/studio"
        className="inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-foreground"
      >
        &larr; Back to Studio
      </Link>

      <h1 className="mt-6 text-3xl font-semibold leading-tight tracking-tight">
        {experiment.title}
      </h1>

      {sourceTheme && (
        <p className="mt-2 text-sm text-muted">
          From theme:{" "}
          <span className="font-medium">{sourceTheme.title}</span>
        </p>
      )}

      <div className="mt-10 space-y-8">
        {/* Hook */}
        <section className="rounded-xl border border-border bg-surface p-6">
          <h2 className="text-xs font-medium uppercase tracking-widest text-muted">
            Hook
          </h2>
          <p className="mt-2 text-lg italic leading-snug">
            &ldquo;{experiment.hook}&rdquo;
          </p>
        </section>

        {/* Details */}
        <dl className="space-y-6">
          <div>
            <dt className="text-xs font-medium uppercase tracking-widest text-muted">
              Concept
            </dt>
            <dd className="mt-2 leading-relaxed">{experiment.concept}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-widest text-muted">
              Format
            </dt>
            <dd className="mt-2 leading-relaxed text-muted">
              {experiment.format}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-widest text-muted">
              Rationale
            </dt>
            <dd className="mt-2 leading-relaxed">{experiment.rationale}</dd>
          </div>
        </dl>

        {/* Scorecard */}
        <section className="rounded-xl border border-border bg-surface p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-medium uppercase tracking-widest text-muted">
              Scorecard
            </h2>
            <span className="rounded-full bg-foreground px-3 py-1 font-mono text-xs font-medium text-background">
              Priority {experiment.scorecard.priorityScore.toFixed(1)}
            </span>
          </div>

          <div className="mt-5 grid grid-cols-5 gap-3">
            {scorecardFields.map(({ key, label }) => (
              <div key={key} className="text-center">
                <div className="font-mono text-2xl font-semibold">
                  {experiment.scorecard[key]}
                </div>
                <div className="mt-1 text-xs text-muted">{label}</div>
              </div>
            ))}
          </div>

          <p className="mt-6 border-t border-border pt-4 text-sm leading-relaxed text-muted">
            {experiment.scorecard.explanation}
          </p>
        </section>
      </div>
    </div>
  );
}
