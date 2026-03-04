import type { ScenarioCard } from "./types";

export const COPILOT_SCENARIOS: ScenarioCard[] = [
  {
    id: "performance-1on1",
    title: "Performance Review 1:1",
    description: "Prepare for a 1:1 focused on performance feedback or growth areas",
    icon: "clipboard",
    prompt:
      "I have a 1:1 coming up where I need to discuss performance with one of my direct reports. Can you help me prepare a structured agenda?",
  },
  {
    id: "skip-level",
    title: "Skip-Level Meeting",
    description: "Prep for a meeting with your manager's reports to build trust",
    icon: "users",
    prompt:
      "I'm doing skip-level 1:1s for the first time with my team's ICs. How should I structure these to build trust without undermining my direct reports?",
  },
  {
    id: "career-growth",
    title: "Career Growth 1:1",
    description: "Help a report develop their career path and growth plan",
    icon: "academic",
    prompt:
      "One of my reports wants to talk about their career growth in our next 1:1. They feel stuck and I want to help them create a development plan.",
  },
  {
    id: "new-report",
    title: "First 1:1 with New Report",
    description: "Set expectations and build rapport with someone new on your team",
    icon: "chat",
    prompt:
      "I have a new person joining my team next week. Help me prepare for our first 1:1 — I want to set the right tone and expectations.",
  },
];

export const SIMULATOR_SCENARIOS: ScenarioCard[] = [
  {
    id: "defensive-underperformer",
    title: "Defensive Underperformer",
    description: "Practice giving feedback to someone who gets defensive and deflects",
    icon: "shield",
    prompt:
      "I need to practice having a performance conversation with a senior engineer who gets very defensive when receiving feedback. They tend to deflect blame and bring up past contributions.",
  },
  {
    id: "unpopular-decision",
    title: "Communicating an Unpopular Decision",
    description: "Deliver news about a reorg, strategy shift, or cancelled project",
    icon: "alert",
    prompt:
      "I need to tell my team that their project is being cancelled and they're being reorged into a different team. Some of them will be upset. Help me practice this conversation.",
  },
  {
    id: "denied-promotion",
    title: "Denied Promotion",
    description: "Explain why a strong performer didn't get the promotion they expected",
    icon: "dollar",
    prompt:
      "One of my best engineers expected a promotion this cycle but didn't get it. I need to explain the decision without losing them. Let's practice.",
  },
  {
    id: "team-conflict",
    title: "Mediating Team Conflict",
    description: "Address tension between two team members who can't work together",
    icon: "users",
    prompt:
      "Two of my senior engineers are in a conflict that's affecting the whole team. They disagree on technical direction and it's become personal. I need to mediate.",
  },
];

export const REFLECT_SCENARIOS: ScenarioCard[] = [
  {
    id: "tough-week",
    title: "Process a Tough Week",
    description: "Unpack what went wrong and find the lesson in it",
    icon: "lightbulb",
    prompt:
      "I had a really tough week and I need to process it. A few things went wrong and I'm not sure if I handled them well.",
  },
  {
    id: "win-reflection",
    title: "Celebrate a Win",
    description: "Reflect on what went well and why, so you can repeat it",
    icon: "academic",
    prompt:
      "Something actually went really well this week and I want to understand why so I can do more of it.",
  },
  {
    id: "leadership-doubt",
    title: "Imposter Syndrome Check-In",
    description: "Work through feelings of doubt about your ability to lead",
    icon: "ear",
    prompt:
      "I've been feeling like I'm not cut out for management. I keep second-guessing my decisions and I'm not sure if my team respects me.",
  },
  {
    id: "general-reflection",
    title: "Open Reflection",
    description: "Free-form reflection on your week as a manager",
    icon: "book",
    prompt:
      "I want to do a general reflection on my week. No specific agenda — just want to talk through what happened and get some perspective.",
  },
];
