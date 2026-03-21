import type { ThemeCluster, OpportunityType } from "./types";

interface BucketDef {
  id: string;
  title: string;
  summary: string;
  opportunityType: OpportunityType;
  keywords: string[];
}

const buckets: BucketDef[] = [
  {
    id: "theme-1",
    title: "Beginner & accessibility questions",
    summary:
      "Audience members who are new to the topic or feel overwhelmed and want a simpler entry point.",
    opportunityType: "question",
    keywords: [
      "beginner",
      "start",
      "new to",
      "confused",
      "easy",
      "simple",
      "basics",
      "intro",
      "how do i",
      "where do i",
      "first time",
    ],
  },
  {
    id: "theme-2",
    title: "Requests for more depth or a follow-up",
    summary:
      "Viewers who found the content valuable and want a deeper dive, more examples, or a part 2.",
    opportunityType: "request",
    keywords: [
      "explain",
      "example",
      "detail",
      "deeper",
      "part 2",
      "elaborate",
      "more about",
      "can you show",
      "tutorial",
      "walk through",
      "follow up",
      "series",
      "depth",
    ],
  },
  {
    id: "theme-3",
    title: "Constraints, objections & edge cases",
    summary:
      "Comments raising real-world limitations — lack of time, money, or fit — that signal content gaps worth addressing.",
    opportunityType: "objection",
    keywords: [
      "but",
      "what if",
      "doesn't work",
      "no time",
      "no money",
      "busy",
      "alternative",
      "instead",
      "unrealistic",
      "not for me",
      "doesn't apply",
      "too hard",
      "can't afford",
    ],
  },
];

function matchesBucket(comment: string, keywords: string[]): boolean {
  const lower = comment.toLowerCase();
  return keywords.some((kw) => lower.includes(kw));
}

function demandSignalFromSize(
  groupSize: number,
  totalComments: number,
): 1 | 2 | 3 | 4 | 5 {
  if (totalComments === 0) return 1;
  const ratio = groupSize / totalComments;
  if (ratio >= 0.4) return 5;
  if (ratio >= 0.25) return 4;
  if (ratio >= 0.15) return 3;
  if (ratio >= 0.05) return 2;
  return 1;
}

export function generateThemeClustersFromComments(
  comments: string[],
): ThemeCluster[] {
  const assigned = new Set<number>();
  const results: ThemeCluster[] = [];

  for (const bucket of buckets) {
    const matched: string[] = [];

    for (let i = 0; i < comments.length; i++) {
      if (assigned.has(i)) continue;
      if (matchesBucket(comments[i], bucket.keywords)) {
        matched.push(comments[i]);
        assigned.add(i);
      }
    }

    if (matched.length === 0) continue;

    results.push({
      id: bucket.id,
      title: bucket.title,
      summary: bucket.summary,
      representativeComments: matched.slice(0, 4),
      demandSignal: demandSignalFromSize(matched.length, comments.length),
      opportunityType: bucket.opportunityType,
    });
  }

  if (results.length === 0) {
    results.push({
      id: "theme-general",
      title: "General audience interest",
      summary:
        "These comments didn't match a specific pattern but signal broad engagement worth exploring.",
      representativeComments: comments.slice(0, 4),
      demandSignal: demandSignalFromSize(comments.length, comments.length),
      opportunityType: "emotion",
    });
  }

  return results;
}
