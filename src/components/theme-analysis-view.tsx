"use client";

import { useMemo } from "react";
import Link from "next/link";
import { loadCreatorExperimentInput } from "@/lib/utils";
import { generateThemeClustersFromComments } from "@/lib/theme-analysis";

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
  const saved = useMemo(() => loadCreatorExperimentInput(), []);

  if (!saved) {
    return (
      <div className="flex flex-col items-center py-24 text-center">
        <p className="font-mono text-sm text-accent">No data</p>
        <h2 className="mt-2 text-xl font-semibold">
          No creator input found.
        </h2>
        <p className="mt-2 max-w-sm text-sm text-muted">
          Complete the setup step first so we can analyze your audience comments.
        </p>
        <Link
          href="/setup"
          className="mt-6 rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background transition-opacity hover:opacity-80"
        >
          Go to Setup
        </Link>
      </div>
    );
  }

  const { creatorProfile, commentInput } = saved;
  const comments = commentInput.comments;
  const themes = generateThemeClustersFromComments(comments);

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
            <span className="font-mono font-medium">{comments.length}</span>
          </div>
        </div>
      </div>

      {/* Theme cards */}
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
        <Link
          href="/setup"
          className="rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-surface-hover"
        >
          Edit Setup
        </Link>
      </div>
    </>
  );
}
