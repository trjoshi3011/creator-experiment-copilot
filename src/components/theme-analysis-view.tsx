"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  loadCreatorExperimentInput,
  loadGeneratedThemes,
  saveGeneratedThemes,
  getSetupSubmissionFingerprint,
} from "@/lib/utils";
import type { SetupSubmission, ThemeCluster } from "@/lib/types";

function SignalDots({ level }: { level: number }) {
  return (
    <span className="inline-flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className={`inline-block h-1.5 w-1.5 rounded-full ${
            i < level ? "bg-accent" : "bg-border"
          }`}
        />
      ))}
    </span>
  );
}

export default function ThemeAnalysisView() {
  const router = useRouter();
  const [hasMounted, setHasMounted] = useState(false);
  const [saved, setSaved] = useState<SetupSubmission | null>(null);
  const [themes, setThemes] = useState<ThemeCluster[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [redirecting, setRedirecting] = useState(false);
  const fingerprintRef = useRef<string>("");

  const fetchThemes = useCallback(
    (input: SetupSubmission, fingerprint: string) => {
      setLoading(true);
      setError(null);

      fetch("/api/analyze-themes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      })
        .then(async (res) => {
          if (!res.ok) {
            const body = await res.json().catch(() => null);
            throw new Error(
              body?.error ?? body?.details ?? `Request failed (${res.status})`,
            );
          }
          return res.json();
        })
        .then((data) => {
          const result = data.themes as ThemeCluster[];
          setThemes(result);
          saveGeneratedThemes({ inputFingerprint: fingerprint, themes: result });
        })
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

    const cached = loadGeneratedThemes(fingerprint);
    if (cached && cached.length > 0) {
      setThemes(cached);
      return;
    }

    fetchThemes(input, fingerprint);
  }, [hasMounted, fetchThemes]);

  function handleRegenerate() {
    if (!saved) return;
    setThemes(null);
    fetchThemes(saved, fingerprintRef.current);
  }

  if (!hasMounted) {
    return (
      <div className="mt-16 flex flex-col items-center py-12 text-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-border border-t-accent" />
        <p className="mt-4 text-sm font-medium">Loading&hellip;</p>
      </div>
    );
  }

  if (!saved || redirecting) {
    return (
      <div className="mt-16 flex flex-col items-center py-12 text-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-border border-t-accent" />
        <p className="mt-4 text-sm font-medium">Redirecting to setup&hellip;</p>
      </div>
    );
  }

  const { creatorProfile, commentInput } = saved;

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
            <span className="text-muted">Comments analyzed</span>{" "}
            <span className="font-mono font-medium">
              {commentInput.comments.length}
            </span>
          </div>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="mt-16 flex flex-col items-center py-12 text-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-border border-t-accent" />
          <p className="mt-4 text-sm font-medium">
            Analyzing audience comments&hellip;
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
            Theme analysis failed
          </h2>
          <p className="mt-2 max-w-md text-sm text-muted">{error}</p>
          <div className="mt-6 flex gap-3">
            <button
              onClick={handleRegenerate}
              className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background transition-opacity hover:opacity-80"
            >
              Try Again
            </button>
            <Link
              href="/setup"
              className="rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-surface-hover"
            >
              Back to Setup
            </Link>
          </div>
        </div>
      )}

      {/* Theme cards */}
      {themes && !loading && (
        <>
          <div className="mt-8 space-y-6">
            {themes.map((theme) => (
              <article
                key={theme.id}
                className="rounded-xl border border-border bg-surface p-6 transition-shadow hover:shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <h2 className="text-lg font-medium leading-snug">
                    {theme.title}
                  </h2>
                  <span className="shrink-0 rounded-full border border-border px-2.5 py-0.5 font-mono text-xs text-muted">
                    {theme.opportunityType}
                  </span>
                </div>

                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {theme.summary}
                </p>

                <div className="mt-4 flex items-center gap-2 text-xs text-muted">
                  <span className="font-medium">Demand</span>
                  <SignalDots level={theme.demandSignal} />
                  <span className="font-mono">{theme.demandSignal}/5</span>
                </div>

                <div className="mt-5 border-t border-border pt-4">
                  <h3 className="text-xs font-medium uppercase tracking-widest text-muted">
                    Representative Comments
                  </h3>
                  <ul className="mt-3 space-y-2">
                    {theme.representativeComments.map((comment, i) => (
                      <li
                        key={i}
                        className="rounded-lg bg-background px-4 py-2.5 text-sm leading-relaxed"
                      >
                        &ldquo;{comment}&rdquo;
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>

          {/* Actions */}
          <div className="mt-12 flex items-center gap-3">
            <Link
              href="/studio"
              className="rounded-full bg-foreground px-6 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-80"
            >
              Generate Video Ideas
            </Link>
            <button
              onClick={handleRegenerate}
              className="rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-surface-hover"
            >
              Regenerate Themes
            </button>
            <Link
              href="/setup"
              className="rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-surface-hover"
            >
              Edit Setup
            </Link>
          </div>
        </>
      )}
    </>
  );
}
