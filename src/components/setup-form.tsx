"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SetupSubmission as SetupSubmissionSchema } from "@/lib/schemas";
import { defaultCreatorProfile } from "@/lib/defaults";
import { saveCreatorExperimentInput } from "@/lib/utils";

function splitCsv(value: string): string[] {
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function splitLines(value: string): string[] {
  return value
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

export default function SetupForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const [niche, setNiche] = useState(defaultCreatorProfile.niche);
  const [audienceDemographic, setAudienceDemographic] = useState(
    defaultCreatorProfile.audienceDemographic,
  );
  const [audienceInterests, setAudienceInterests] = useState(
    defaultCreatorProfile.audienceInterests.join(", "),
  );
  const [contentPillars, setContentPillars] = useState(
    defaultCreatorProfile.contentPillars.join(", "),
  );
  const [recentTopics, setRecentTopics] = useState(
    defaultCreatorProfile.recentTopics.join(", "),
  );
  const [tone, setTone] = useState(defaultCreatorProfile.tone);

  const [postTopic, setPostTopic] = useState("");
  const [postCaption, setPostCaption] = useState("");
  const [comments, setComments] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const result = SetupSubmissionSchema.safeParse({
      creatorProfile: {
        niche,
        audienceDemographic,
        audienceInterests: splitCsv(audienceInterests),
        contentPillars: splitCsv(contentPillars),
        recentTopics: splitCsv(recentTopics),
        tone,
      },
      commentInput: {
        postTopic: postTopic || undefined,
        postCaption: postCaption || undefined,
        comments: splitLines(comments),
      },
    });

    if (!result.success) {
      setError(result.error.message);
      return;
    }

    saveCreatorExperimentInput(result.data);
    router.push("/themes");
  }

  const inputClass =
    "w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm transition-colors placeholder:text-muted/60 focus:border-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20";
  const labelClass = "block text-sm font-medium";

  return (
    <form onSubmit={handleSubmit} className="space-y-12">
      {/* Creator Profile */}
      <section>
        <h2 className="text-xs font-medium uppercase tracking-widest text-muted">
          Creator Profile
        </h2>
        <div className="mt-5 space-y-5">
          <div>
            <label htmlFor="niche" className={labelClass}>
              Niche
            </label>
            <input
              id="niche"
              type="text"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              className={`mt-1.5 ${inputClass}`}
            />
          </div>

          <div>
            <label htmlFor="audienceDemographic" className={labelClass}>
              Audience Demographic
            </label>
            <input
              id="audienceDemographic"
              type="text"
              value={audienceDemographic}
              onChange={(e) => setAudienceDemographic(e.target.value)}
              className={`mt-1.5 ${inputClass}`}
            />
          </div>

          <div>
            <label htmlFor="audienceInterests" className={labelClass}>
              Audience Interests
              <span className="ml-1 font-normal text-muted">
                (comma-separated)
              </span>
            </label>
            <textarea
              id="audienceInterests"
              rows={2}
              value={audienceInterests}
              onChange={(e) => setAudienceInterests(e.target.value)}
              className={`mt-1.5 ${inputClass}`}
            />
          </div>

          <div>
            <label htmlFor="contentPillars" className={labelClass}>
              Content Pillars
              <span className="ml-1 font-normal text-muted">
                (comma-separated)
              </span>
            </label>
            <textarea
              id="contentPillars"
              rows={2}
              value={contentPillars}
              onChange={(e) => setContentPillars(e.target.value)}
              className={`mt-1.5 ${inputClass}`}
            />
          </div>

          <div>
            <label htmlFor="recentTopics" className={labelClass}>
              Recent Topics
              <span className="ml-1 font-normal text-muted">
                (comma-separated)
              </span>
            </label>
            <textarea
              id="recentTopics"
              rows={2}
              value={recentTopics}
              onChange={(e) => setRecentTopics(e.target.value)}
              className={`mt-1.5 ${inputClass}`}
            />
          </div>

          <div>
            <label htmlFor="tone" className={labelClass}>
              Tone
            </label>
            <input
              id="tone"
              type="text"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className={`mt-1.5 ${inputClass}`}
            />
          </div>
        </div>
      </section>

      <hr className="border-border" />

      {/* Post Context */}
      <section>
        <h2 className="text-xs font-medium uppercase tracking-widest text-muted">
          Post Context
        </h2>
        <div className="mt-5 space-y-5">
          <div>
            <label htmlFor="postTopic" className={labelClass}>
              Post Topic
            </label>
            <input
              id="postTopic"
              type="text"
              value={postTopic}
              onChange={(e) => setPostTopic(e.target.value)}
              placeholder="e.g. time-blocking"
              className={`mt-1.5 ${inputClass}`}
            />
          </div>

          <div>
            <label htmlFor="postCaption" className={labelClass}>
              Post Caption
            </label>
            <textarea
              id="postCaption"
              rows={2}
              value={postCaption}
              onChange={(e) => setPostCaption(e.target.value)}
              placeholder="Paste the original post caption"
              className={`mt-1.5 ${inputClass}`}
            />
          </div>
        </div>
      </section>

      <hr className="border-border" />

      {/* Audience Comments */}
      <section>
        <h2 className="text-xs font-medium uppercase tracking-widest text-muted">
          Audience Comments
        </h2>
        <div className="mt-5">
          <label htmlFor="comments" className={labelClass}>
            Comments
            <span className="ml-1 font-normal text-muted">(one per line)</span>
          </label>
          <textarea
            id="comments"
            rows={8}
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Paste audience comments here, one per line"
            className={`mt-1.5 ${inputClass}`}
          />
        </div>
      </section>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-400">
          {error}
        </div>
      )}

      <button
        type="submit"
        className="w-full rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-80 sm:w-auto"
      >
        Analyze Audience Demand
      </button>
    </form>
  );
}
