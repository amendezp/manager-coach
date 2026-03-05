import type { CoachableTemplate } from "./types";

export const COACHABLE_TEMPLATES: CoachableTemplate[] = [
  {
    id: "constructive-feedback",
    title: "Providing Constructive Feedback",
    description:
      "Deliver specific, actionable feedback that drives improvement without damaging the relationship",
    icon: "clipboard",
    learningConcepts: [
      {
        title: "SBI Feedback Model",
        summary:
          "Structure feedback as Situation-Behavior-Impact: describe the specific context, the observable behavior (not intent), and its measurable impact on the team or outcome. This keeps feedback objective and actionable.",
        framework: "SBI Model",
      },
      {
        title: "Radical Candor",
        summary:
          "Great feedback sits at the intersection of Caring Personally and Challenging Directly. Avoid Ruinous Empathy (caring without challenging) and Obnoxious Aggression (challenging without caring).",
        framework: "Radical Candor",
      },
    ],
  },
  {
    id: "performance-review",
    title: "Performance Review",
    description:
      "Conduct a balanced, forward-looking performance conversation that motivates growth",
    icon: "academic",
    learningConcepts: [
      {
        title: "OSKAR Coaching Framework",
        summary:
          "Structure the review around Outcome (desired result), Scaling (where are we 1-10?), Know-how (existing strengths), Affirm & Action (next steps), and Review (follow-up plan).",
        framework: "OSKAR",
      },
      {
        title: "Growth Mindset Framing",
        summary:
          "Frame feedback in terms of growth trajectory rather than fixed labels. Say 'You are developing strength in X' rather than 'You are bad at X.' Focus on behaviors that can change, not character.",
      },
    ],
  },
  {
    id: "onboarding-new-hire",
    title: "Onboarding a New Hire",
    description:
      "Set expectations, build rapport, and create a strong foundation in the first conversation",
    icon: "users",
    learningConcepts: [
      {
        title: "Expectations Setting",
        summary:
          "Clearly define what success looks like at 30, 60, and 90 days. Discuss communication preferences, meeting cadence, and how you give feedback. Make implicit expectations explicit.",
        framework: "30-60-90 Plan",
      },
      {
        title: "Psychological Safety",
        summary:
          "New hires need to feel safe asking 'stupid questions.' Signal that vulnerability is welcome by sharing your own learning moments and explicitly saying 'There are no bad questions here.'",
        framework: "Amy Edmondson's Framework",
      },
    ],
  },
  {
    id: "compensation-discussion",
    title: "Compensation Discussion",
    description:
      "Handle raise requests or explain compensation decisions with transparency and empathy",
    icon: "dollar",
    learningConcepts: [
      {
        title: "Interest-Based Negotiation",
        summary:
          "Focus on underlying interests, not positions. A raise request might really be about feeling valued, career progression, or market fairness. Understand the 'why' before discussing numbers.",
        framework: "Getting to Yes",
      },
      {
        title: "Transparency Within Constraints",
        summary:
          "Be as transparent as your organization allows about how compensation decisions are made. Even when you can't share exact numbers, explaining the process builds trust.",
      },
    ],
  },
  {
    id: "cross-functional-conflict",
    title: "Cross-Functional Conflict",
    description:
      "Navigate disagreements between teams or departments without taking sides",
    icon: "shield",
    learningConcepts: [
      {
        title: "DESC Conflict Resolution",
        summary:
          "Describe the situation objectively, Express how it affects your team, Specify what change you need, and outline the positive Consequences of resolving it. Stays fact-based, not emotional.",
        framework: "DESC Model",
      },
      {
        title: "Active Listening",
        summary:
          "In conflict, most people listen to respond, not to understand. Practice reflecting back what you hear ('So what I'm hearing is...') before offering your perspective. This alone de-escalates most tension.",
      },
    ],
  },
  {
    id: "performance-improvement-plan",
    title: "Performance Improvement Plan",
    description:
      "Have the PIP conversation with clarity, compassion, and a genuine path forward",
    icon: "alert",
    learningConcepts: [
      {
        title: "Progressive Accountability",
        summary:
          "A PIP should never be a surprise. Use the Accountability Dial: Mention → Invitation → Conversation → Boundary → Limit. By PIP time, you should be at the 'Boundary' stage.",
        framework: "Accountability Dial",
      },
      {
        title: "GROW Coaching Model",
        summary:
          "Even in a PIP conversation, coach toward a solution. Goal: what does good look like? Reality: where are they now? Options: what support can you provide? Will: what specific commitments will they make?",
        framework: "GROW Model",
      },
    ],
  },
  {
    id: "firing-reassignment",
    title: "Firing or Reassignment",
    description:
      "Deliver the hardest news with dignity, clarity, and respect for the person",
    icon: "alert",
    learningConcepts: [
      {
        title: "Compassionate Directness",
        summary:
          "Don't soften the message so much that it's unclear. Lead with the decision, then show compassion. 'We've made the decision to let you go, effective today. I want to make sure you're supported through this.'",
      },
      {
        title: "Legal & HR Boundaries",
        summary:
          "Know what you can and cannot say. Stick to facts, not opinions. Don't make promises about severance or references without HR approval. Have HR or legal present when required by policy.",
      },
    ],
  },
  {
    id: "interview-hiring",
    title: "Interview (Hiring)",
    description:
      "Run structured, equitable interviews that surface the best candidate signal",
    icon: "chat",
    learningConcepts: [
      {
        title: "Behavioral Interviewing",
        summary:
          "Past behavior is the best predictor of future behavior. Ask 'Tell me about a time when...' instead of hypotheticals. Probe with follow-ups: What was your role specifically? What was the outcome?",
        framework: "STAR Method",
      },
      {
        title: "Structured Evaluation",
        summary:
          "Score candidates on predefined criteria immediately after each interview. Don't compare candidates to each other — compare each to the rubric. This reduces bias significantly.",
      },
    ],
  },
  {
    id: "managing-up",
    title: "Managing Up",
    description:
      "Communicate effectively with your own manager — escalate, align, and advocate",
    icon: "lightbulb",
    learningConcepts: [
      {
        title: "Executive Communication",
        summary:
          "Lead with the conclusion, then provide context. Your manager wants 'Here's what I recommend and why' not a 10-minute backstory. Use the Pyramid Principle: answer first, evidence second.",
        framework: "Pyramid Principle",
      },
      {
        title: "SCARF Model",
        summary:
          "Your manager has the same threat responses you do. Status, Certainty, Autonomy, Relatedness, and Fairness drive their reactions. Frame requests in terms of what increases their SCARF, not just yours.",
        framework: "SCARF Model",
      },
    ],
  },
  {
    id: "delivering-bad-news",
    title: "Delivering Bad News",
    description:
      "Communicate reorgs, project cancellations, or strategy shifts without losing trust",
    icon: "ear",
    learningConcepts: [
      {
        title: "Change Management",
        summary:
          "People move through change in stages: shock, resistance, exploration, commitment. Don't expect immediate buy-in. Acknowledge the loss before selling the vision. 'I know this is hard' before 'Here's why it matters.'",
      },
      {
        title: "Nonviolent Communication (NVC)",
        summary:
          "Separate observation from evaluation. State what happened (fact), how it affects people (feeling), what the underlying need is, and what you're requesting. Avoids triggering defensiveness.",
        framework: "NVC",
      },
    ],
  },
];
