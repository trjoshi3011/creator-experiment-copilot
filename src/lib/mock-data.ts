import type { z } from "zod";
import type {
  CreatorProfile,
  CommentInput,
  ThemeCluster,
  Experiment,
} from "./schemas";

export const creatorProfile: z.infer<typeof CreatorProfile> = {
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

export const commentInput: z.infer<typeof CommentInput> = {
  postCaption:
    "How I time-block my entire week in 20 minutes (template in bio)",
  postTopic: "time-blocking",
  comments: [
    "This is great but what do you do when your whole day gets derailed by meetings?",
    "I tried time blocking but I always underestimate how long things take 😭",
    "Can you make a version of this for students with irregular schedules?",
    "How do you stay consistent with this? I do it for a week then quit",
    "Do you use a paper planner or an app? I've tried both and can't stick with either",
    "What about energy management? I'm useless after 2pm no matter what I plan",
    "I work two part-time jobs and go to school, this doesn't feel realistic for me",
    "Would love to see how you handle group projects with time blocking",
    "Time blocking stresses me out honestly. Is there a softer version?",
    "Can you do one of these for job searching? I'm spending hours a day applying and getting nowhere",
    "This helped me so much during finals week, literally saved my GPA 🙌",
    "Okay but what do you do on days when you just have zero motivation",
  ],
};

export const themeClusters: z.infer<typeof ThemeCluster>[] = [
  {
    id: "theme-adaptability",
    title: "Time blocking doesn't fit my chaotic schedule",
    summary:
      "Multiple commenters feel the rigid structure of time-blocking breaks down when schedules are unpredictable — irregular class times, part-time jobs, and surprise meetings all disrupt the system.",
    representativeComments: [
      "This is great but what do you do when your whole day gets derailed by meetings?",
      "Can you make a version of this for students with irregular schedules?",
      "I work two part-time jobs and go to school, this doesn't feel realistic for me",
    ],
    demandSignal: 5,
    opportunityType: "objection",
  },
  {
    id: "theme-consistency",
    title: "Starting strong but can't sustain the habit",
    summary:
      "A recurring thread around motivation and consistency — people adopt the system but drop off after a few days, pointing to deeper questions about habit formation and energy management.",
    representativeComments: [
      "How do you stay consistent with this? I do it for a week then quit",
      "Okay but what do you do on days when you just have zero motivation",
      "What about energy management? I'm useless after 2pm no matter what I plan",
    ],
    demandSignal: 4,
    opportunityType: "confusion",
  },
  {
    id: "theme-adjacent-use-cases",
    title: "Apply this framework to job searching and group work",
    summary:
      "Several comments request the same structured approach but applied to adjacent problems like job searching and managing group projects — signals appetite for a content series.",
    representativeComments: [
      "Can you do one of these for job searching? I'm spending hours a day applying and getting nowhere",
      "Would love to see how you handle group projects with time blocking",
      "Time blocking stresses me out honestly. Is there a softer version?",
    ],
    demandSignal: 3,
    opportunityType: "request",
  },
];

export const experiments: z.infer<typeof Experiment>[] = [
  {
    id: "exp-flexible-blocking",
    sourceThemeId: "theme-adaptability",
    title: "The anti-schedule: time blocking for people with chaotic lives",
    concept:
      "Show a flexible time-blocking method that uses themed blocks and buffer zones instead of hour-by-hour planning — designed for students juggling classes, work, and life.",
    hook: "Time blocking ruined my productivity — here's what I do instead",
    format: "60s talking-head with on-screen planner demo",
    rationale:
      "Directly addresses the highest-demand objection. Reframing the system as flexible lowers the barrier and re-engages people who bounced off the original video.",
    scorecard: {
      audienceAppeal: 5,
      riskLevel: 1,
      novelty: 4,
      clarity: 5,
      audienceFit: 5,
      priorityScore: 9.2,
      explanation:
        "Low risk, high resonance. This reframes existing content to answer the single most common objection — a near-guaranteed engagement driver.",
    },
  },
  {
    id: "exp-energy-management",
    sourceThemeId: "theme-consistency",
    title: "Stop planning your time — plan your energy instead",
    concept:
      "Introduce energy mapping: rate each hour of the day by energy level for a week, then align task difficulty to energy peaks. Pairs with time blocking as a layer, not a replacement.",
    hook: "You don't have a time problem. You have an energy problem.",
    format: "90s voice-over with animated energy graph and daily schedule overlay",
    rationale:
      "Energy management surfaced repeatedly and is an under-covered angle in the productivity niche. Positions the creator as going deeper than surface-level advice.",
    scorecard: {
      audienceAppeal: 4,
      riskLevel: 2,
      novelty: 5,
      clarity: 4,
      audienceFit: 5,
      priorityScore: 8.4,
      explanation:
        "High novelty angle that differentiates from typical productivity content. Slight clarity risk because the concept needs a good visual, but strong audience fit.",
    },
  },
  {
    id: "exp-job-search-system",
    sourceThemeId: "theme-adjacent-use-cases",
    title: "The 2-hour job search system that actually gets callbacks",
    concept:
      "Apply the time-blocking framework to job hunting: a repeatable 2-hour daily block split into targeted search, tailored applications, and follow-ups — with a tracker template.",
    hook: "I applied to 200 jobs and heard nothing. Then I tried this.",
    format: "60s screen-recording walkthrough with Notion template reveal",
    rationale:
      "Direct audience request with high emotional stakes. Job searching is a pain point that maps perfectly to the creator's career-growth pillar and extends the time-blocking series.",
    scorecard: {
      audienceAppeal: 5,
      riskLevel: 2,
      novelty: 3,
      clarity: 5,
      audienceFit: 4,
      priorityScore: 7.8,
      explanation:
        "Strong practical appeal and clear audience demand. Novelty is moderate since job-search content exists, but the structured system angle is a differentiator.",
    },
  },
  {
    id: "exp-motivation-myth",
    sourceThemeId: "theme-consistency",
    title: "What I do on days I have zero motivation (real talk)",
    concept:
      "A candid, low-production video showing the creator's actual low-motivation routine — minimum viable habits, permission to scale back, and how 'bad' days still move the needle.",
    hook: "I didn't want to do anything today. Here's what I did anyway.",
    format: "45s casual vlog-style, filmed on a real low-energy day",
    rationale:
      "Authenticity play that builds trust. The lo-fi format itself reinforces the message and stands out in a niche full of hyper-optimized routines.",
    scorecard: {
      audienceAppeal: 4,
      riskLevel: 3,
      novelty: 4,
      clarity: 4,
      audienceFit: 5,
      priorityScore: 7.1,
      explanation:
        "Emotionally resonant and highly relatable. Moderate risk because the casual format could underperform algorithmically, but it deepens audience loyalty.",
    },
  },
  {
    id: "exp-group-project",
    sourceThemeId: "theme-adjacent-use-cases",
    title: "How to time-block a group project (without losing friends)",
    concept:
      "Walk through setting up a shared time-blocking system for a 4-person group project: role assignment, async check-ins, and a shared calendar template that actually gets used.",
    hook: "Group projects don't fail because of lazy people — they fail because of this",
    format: "75s split-screen: solo planning view vs. shared team calendar",
    rationale:
      "Niche-specific request from students. Lower total demand than other themes but very high specificity — good for building authority with the student segment.",
    scorecard: {
      audienceAppeal: 3,
      riskLevel: 3,
      novelty: 4,
      clarity: 3,
      audienceFit: 4,
      priorityScore: 5.9,
      explanation:
        "Narrower audience but high relevance for the student segment. Complexity of showing a multi-person system in short-form is the main risk to clarity.",
    },
  },
];
