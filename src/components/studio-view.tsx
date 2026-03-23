"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  loadCreatorExperimentInput,
  loadGeneratedThemes,
  loadGeneratedExperiments,
  saveGeneratedExperiments,
  getSetupSubmissionFingerprint,
} from "@/lib/utils";
import type { SetupSubmission, ThemeCluster, Experiment } from "@/lib/types";

const scorecardFields = [
  { key: "audienceAppeal", label: "Appeal" },
  { key: "riskLevel", label: "Risk" },
  { key: "novelty", label: "Novelty" },
  { key: "clarity", label: "Clarity" },
  { key: "audienceFit", label: "Fit" },
] as const;

export default function StudioView() {
  const router = useRouter();
  const [hasMounted, setHasMounted] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [saved, setSaved] = useState<SetupSubmission | null>(null);
  const [themes, setThemes] = useState<ThemeCluster[] | null>(null);
  const [experiments, setExperiments] = useState<Experiment[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fingerprintRef = useRef<string>("");
  const hasRequestedRef = useRef(false);

  const fetchExperiments = useCallback(
    (
      creatorProfile: SetupSubmission["creatorProfile"],
      themeList: ThemeCluster[],
      fingerprint: string,
    ) => {
      setLoading(true);
      setError(null);

      const payload = JSON.stringify({ creatorProfile, themes: themeList });

      async function attempt(retriesLeft: number): Promise<void> {
        const res = await fetch("/api/generate-experiments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: payload,
        });

        if (!res.ok) {
          const body = await res.json().catch(() => null);
          const isRateLimit =
            res.status === 429 ||
            /rate.?limit|quota|resource.?exhausted/i.test(
              body?.error ?? body?.details ?? "",
            );

          if (isRateLimit && retriesLeft > 0) {
            const delayMatch = String(body?.retryDelay ?? "").match(/(\d+)s/);
            const delayMs = delayMatch ? parseInt(delayMatch[1], 10) * 1000 : 3000;
            console.warn(
              `Rate limited (${res.status}). Retrying in ${delayMs}ms…`,
              body,
            );
            await new Promise((r) => setTimeout(r, delayMs));
            return attempt(retriesLeft - 1);
          }

          const rawMessage =
            body?.error ?? body?.details ?? `Request failed (${res.status})`;
          console.error("generate-experiments error:", rawMessage, body);

          throw new Error(
            isRateLimit
              ? "The AI service is temporarily busy. Please wait a moment and try again."
              : "Something went wrong while generating experiments. Please try again.",
          );
        }

        const data = await res.json();
        const result = (data.experiments as Experiment[]).sort(
          (a, b) => b.scorecard.priorityScore - a.scorecard.priorityScore,
        );
        setExperiments(result);
        saveGeneratedExperiments({
          inputFingerprint: fingerprint,
          experiments: result,
        });
      }

      attempt(1)
        .catch((err) => {
          setError(err instanceof Error ? err.message : "Unknown error");
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [],
  );

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!hasMounted) return;

    const input = loadCreatorExperimentInput();
    setSaved(input);
    if (!input) {
      setRedirecting(true);
      router.replace("/setup");
      return;
    }

    const fingerprint = getSetupSubmissionFingerprint(input);
    fingerprintRef.current = fingerprint;

    const cachedThemes = loadGeneratedThemes(fingerprint);
    setThemes(cachedThemes);
    if (!cachedThemes || cachedThemes.length === 0) {
      setRedirecting(true);
      router.replace("/themes");
      return;
    }

    const cachedExperiments = loadGeneratedExperiments(fingerprint);
    if (cachedExperiments && cachedExperiments.length > 0) {
      setExperiments(cachedExperiments);
      return;
    }

    if (hasRequestedRef.current) return;
    hasRequestedRef.current = true;

    fetchExperiments(input.creatorProfile, cachedThemes, fingerprint);
  }, [hasMounted, router, fetchExperiments]);

  function handleRegenerate() {
    if (!saved || !themes || loading) return;
    setExperiments(null);
    hasRequestedRef.current = true;
    fetchExperiments(saved.creatorProfile, themes, fingerprintRef.current);
  }

  if (!hasMounted || redirecting || !saved || !themes || themes.length === 0) {
    return (
      <div className="mt-16 flex flex-col items-center py-12 text-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-border border-t-accent" />
        <p className="mt-4 text-sm font-medium">Loading&hellip;</p>
      </div>
    );
  }

  const { creatorProfile } = saved;

  return (
    <>
      {/* Summary */}
      <div className="rounded-xl border border-border bg-surface p-5">
        <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
          <div>
            <span className="text-muted">Niche</span>{" "}
            <span className="font-medium">{creatorProfile.niche}</span>
          </div>
          <div>
            <span className="text-muted">Audience</span>{" "}
            <span className="font-medium">
              {creatorProfile.audienceDemographic}
            </span>
          </div>
          <div>
            <span className="text-muted">Themes</span>{" "}
            <span className="font-mono font-medium">{themes.length}</span>
          </div>
          {experiments && (
            <div>
              <span className="text-muted">Ideas</span>{" "}
              <span className="font-mono font-medium">
                {experiments.length}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/themes"
          className="rounded-full border border-border px-4 py-1.5 text-sm font-medium transition-colors hover:bg-surface-hover"
        >
          &larr; View Themes
        </Link>
        <Link
          href="/setup"
          className="rounded-full border border-border px-4 py-1.5 text-sm font-medium transition-colors hover:bg-surface-hover"
        >
          Edit Setup
        </Link>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="mt-16 flex flex-col items-center py-12 text-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-border border-t-accent" />
          <p className="mt-4 text-sm font-medium">
            Generating video experiment ideas&hellip;
          </p>
          <p className="mt-1 text-xs text-muted">
            This may take a few seconds.
          </p>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="mt-12 flex flex-col items-center py-12 text-center">
          <p className="font-mono text-sm text-accent">Error</p>
          <h2 className="mt-2 text-lg font-semibold">
            Experiment generation failed
          </h2>
          <p className="mt-2 max-w-md text-sm text-muted">{error}</p>
          <div className="mt-6 flex gap-3">
            <button
              onClick={handleRegenerate}
              disabled={loading}
              className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background transition-opacity hover:opacity-80 disabled:opacity-50"
            >
              Try Again
            </button>
            <Link
              href="/themes"
              className="rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-surface-hover"
            >
              Back to Themes
            </Link>
          </div>
        </div>
      )}

      {/* Experiment cards */}
      {experiments && !loading && (
        <>
          <div className="mt-10 space-y-6">
            {experiments.map((exp, rank) => (
              <article
                key={exp.id}
                className="rounded-xl border border-border bg-surface p-6 transition-shadow hover:shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-sm text-muted">
                      {String(rank + 1).padStart(2, "0")}
                    </span>
                    <h3 className="text-lg font-medium leading-snug">
                      {exp.title}
                    </h3>
                  </div>
                  <span className="shrink-0 rounded-full bg-foreground px-3 py-1 font-mono text-xs font-medium text-background">
                    {exp.scorecard.priorityScore.toFixed(1)}
                  </span>
                </div>

                <dl className="mt-4 space-y-3 text-sm">
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-widest text-muted">
                      Concept
                    </dt>
                    <dd className="mt-1 leading-relaxed text-muted">
                      {exp.concept}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-widest text-muted">
                      Hook
                    </dt>
                    <dd className="mt-1 italic">&ldquo;{exp.hook}&rdquo;</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-widest text-muted">
                      Format
                    </dt>
                    <dd className="mt-1 text-muted">{exp.format}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-widest text-muted">
                      Rationale
                    </dt>
                    <dd className="mt-1 leading-relaxed text-muted">
                      {exp.rationale}
                    </dd>
                  </div>
                </dl>

                {/* Scorecard */}
                <div className="mt-5 border-t border-border pt-4">
                  <div className="flex flex-wrap items-center gap-2">
                    {scorecardFields.map(({ key, label }) => (
                      <span
                        key={key}
                        className="rounded-full border border-border px-2.5 py-0.5 font-mono text-xs text-muted"
                      >
                        {label} {exp.scorecard[key]}/5
                      </span>
                    ))}
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    {exp.scorecard.explanation}
                  </p>
                </div>
              </article>
            ))}
          </div>

          {/* Actions */}
          <div className="mt-12 flex items-center gap-3">
            <button
              onClick={handleRegenerate}
              disabled={loading}
              className="rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-surface-hover disabled:opacity-50"
            >
              Regenerate Ideas
            </button>
          </div>
        </>
      )}
    </>
  );
}
