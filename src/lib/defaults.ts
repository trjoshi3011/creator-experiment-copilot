import type { CreatorProfile, CommentInput } from "./types";

export const defaultCreatorProfile: CreatorProfile = {
  niche: "productivity, studying, and career growth",
  audienceDemographic: "college students and early-career professionals (18–28)",
  audienceInterests: [
    "study techniques",
    "time management",
    "interview prep",
    "building habits",
    "remote work tips",
    "side projects",
  ],
  contentPillars: [
    "study methods that actually work",
    "productivity systems for busy people",
    "career advice without the fluff",
  ],
  recentTopics: [
    "Pomodoro vs. time-blocking",
    "how I passed my CPA while working full-time",
    "5 resume mistakes I see every week",
  ],
  tone: "practical, supportive, and clear",
};

export const defaultCommentInput: CommentInput = {
  postCaption: "",
  postTopic: "",
  comments: [],
};
