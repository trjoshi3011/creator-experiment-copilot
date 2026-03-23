"use client";

import { useMemo } from "react";
import Link from "next/link";
import { loadCreatorExperimentInput } from "@/lib/utils";
import { generateThemeClustersFromComments } from "@/lib/theme-analysis";
import { generateExperimentsFromThemes } from "@/lib/experiment-generation";

const scorecardFields = [
  { key: "audienceAppeal", label: "Appeal" },
  { key: "riskLevel", label: "Risk" },
  { key: "novelty", label: "Novelty" },
  { key: "clarity", label: "Clarity" },
  { key: "audienceFit", label: "Fit" },
] as const;

export default function StudioView() {
  const saved = useMemo(() => loadCreatorExperimentInput(), []);

  if (!saved) {
    return (
      <div className="flex flex-col items-center py-24 text-center">
        <p className="font-mono text-sm text-accent">No data</p>
        <h2 className="mt-2 text-xl font-semibold">No creator input found.</h2>
        <p className="mt-2 max-w-sm text-sm text-muted">
          Complete the setup step first so we can generate experiment ideas from
          your audience comments.
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
  const experiments = generateExperimentsFromThemes({ creatorProfile, themes });

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
            <span className="text-muted">Comments</span>{" "}
            <span className="font-mono font-medium">{comments.length}</span>
          </div>
          <div>
            <span className="text-muted">Themes</span>{" "}
            <span className="font-mono font-medium">{themes.length}</span>
          </div>
          <div>
            <span className="text-muted">Ideas</span>{" "}
            <span className="font-mono font-medium">{experiments.length}</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-6 flex gap-3">
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

      {/* Experiment cards */}
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
    </>
  );
}
