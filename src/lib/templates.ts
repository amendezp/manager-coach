import type { CoachableTemplate } from "./types";

export const COACHABLE_TEMPLATES: CoachableTemplate[] = [
  {
    id: "constructive-feedback",
    title: "Providing Constructive Feedback",
    description:
      "Deliver specific, actionable feedback that drives improvement without damaging the relationship",
    icon: "clipboard",
    color: "accent-green",
    learningConcepts: [
      {
        title: "SBI Feedback Model",
        summary:
          "Structure every piece of feedback using three components: Situation (when and where it happened), Behavior (the specific, observable action — not your interpretation of their intent), and Impact (the measurable effect on the team, project, or outcome). For example: 'In yesterday's sprint review [Situation], you interrupted two team members mid-sentence [Behavior], which made them hesitant to share ideas for the rest of the meeting [Impact].' This framework keeps feedback objective and gives the other person something concrete to act on.",
        framework: "SBI Model",
      },
      {
        title: "Radical Candor",
        summary:
          "Kim Scott's framework maps feedback along two axes: Care Personally and Challenge Directly. The best feedback lives in the upper-right quadrant where both are high. When you care but don't challenge, you fall into Ruinous Empathy — you withhold honest feedback to avoid discomfort, which ultimately hurts the person's growth. When you challenge without caring, that's Obnoxious Aggression. The goal: show you genuinely care about the person's success, then be direct about what needs to change. Start with 'I'm telling you this because I believe in your potential' — then deliver the hard truth.",
        framework: "Radical Candor",
      },
    ],
  },
  {
    id: "one-on-one",
    title: "1-on-1 Check-in",
    description:
      "Run effective, trust-building 1-on-1s that go beyond status updates",
    icon: "chat",
    color: "accent-blue",
    learningConcepts: [
      {
        title: "Coaching vs. Directing",
        summary:
          "The GROW model provides a structure for coaching conversations: Goal (what do you want to achieve?), Reality (where are you now?), Options (what could you do?), Will (what will you do?). Great 1-on-1s are 90% listening, 10% talking. Resist the urge to solve problems immediately. Instead, ask open-ended questions: 'What's on your mind?', 'What's the real challenge here for you?', 'What have you already tried?' Let the other person own the agenda — your job is to help them think, not to think for them.",
        framework: "GROW Model",
      },
      {
        title: "Building Psychological Safety",
        summary:
          "Amy Edmondson's research shows that high-performing teams aren't ones that make fewer mistakes — they're ones where people feel safe surfacing problems early. As a manager, you build this through consistency: showing up to every 1-on-1, following up on what they mentioned last time, and modeling vulnerability by sharing your own challenges. When someone brings you bad news, your reaction in that moment determines whether they'll bring you bad news again. Respond with curiosity ('Tell me more'), not judgment.",
        framework: "Amy Edmondson's Framework",
      },
    ],
  },
  {
    id: "performance-review",
    title: "Performance Review",
    description:
      "Conduct a balanced, forward-looking performance conversation that motivates growth",
    icon: "academic",
    color: "accent-violet",
    learningConcepts: [
      {
        title: "OSKAR Coaching Framework",
        summary:
          "Structure performance reviews around five steps: Outcome (what does success look like?), Scaling (on a scale of 1-10, where are we today?), Know-how (what strengths and resources already exist?), Affirm & Action (acknowledge progress, then define next steps), and Review (set a follow-up checkpoint). The scaling question is particularly powerful — it makes abstract performance concrete and helps both parties calibrate without defensiveness. If they say '6', ask 'What would make it a 7?'",
        framework: "OSKAR",
      },
      {
        title: "Growth Mindset Framing",
        summary:
          "Carol Dweck's research shows that how you frame feedback changes whether people hear it as a threat or an opportunity. Say 'You're developing strength in X' rather than 'You're bad at X.' Say 'This skill hasn't clicked yet' rather than 'This isn't your strength.' Focus on behaviors that can change, not character traits. When reviewing past performance, anchor to growth trajectory — where they started vs. where they are now — rather than comparing them to others.",
      },
    ],
  },
  {
    id: "managing-up",
    title: "Managing Up",
    description:
      "Communicate effectively with your own manager — escalate, align, and advocate",
    icon: "lightbulb",
    color: "accent-amber",
    learningConcepts: [
      {
        title: "Executive Communication",
        summary:
          "The Pyramid Principle (developed at McKinsey by Barbara Minto) teaches you to lead with the answer, then provide supporting evidence. Your manager wants 'Here's what I recommend and why' — not a 10-minute backstory that builds to a conclusion. Structure your communication as: recommendation first, then 2-3 supporting reasons, then details only if asked. This respects their time and makes it easy for them to say yes or redirect you quickly.",
        framework: "Pyramid Principle",
      },
      {
        title: "SCARF Model",
        summary:
          "David Rock's SCARF model identifies five domains that trigger threat or reward responses in the brain: Status (feeling respected), Certainty (knowing what's coming), Autonomy (having control), Relatedness (feeling connected), and Fairness (being treated equitably). Your manager has the same neurological responses you do. When you need to escalate a problem, frame it in terms that increase their SCARF — protect their status by giving them a heads-up before the meeting, increase their certainty by presenting options with tradeoffs, and preserve their autonomy by letting them choose the path forward.",
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
    color: "accent-red",
    learningConcepts: [
      {
        title: "Change Management",
        summary:
          "People process change in predictable stages: shock, resistance, exploration, and commitment. Don't expect immediate buy-in — it's psychologically impossible. When delivering bad news, acknowledge the emotional reality before explaining the rationale. Say 'I know this is hard and I understand if you're frustrated' before 'Here's why this decision was made.' Give people space to react. Silence after bad news isn't a problem to fix — it's the brain processing. Wait. Then ask 'What questions do you have?' rather than rushing to fill the silence.",
      },
      {
        title: "Nonviolent Communication (NVC)",
        summary:
          "Marshall Rosenberg's NVC framework has four steps: Observation (state the objective fact without judgment), Feeling (name the emotion it creates), Need (identify the underlying need at stake), and Request (make a specific, actionable ask). For example: 'The project timeline was moved up by three weeks [Observation]. I'm concerned [Feeling] because the team needs adequate time to deliver quality work [Need]. Can we discuss which features to deprioritize? [Request].' This structure prevents defensiveness because you're sharing your experience, not attacking theirs.",
        framework: "NVC",
      },
    ],
  },
  {
    id: "compensation-discussion",
    title: "Compensation Discussion",
    description:
      "Handle raise requests or explain compensation decisions with transparency and empathy",
    icon: "dollar",
    color: "accent-teal",
    learningConcepts: [
      {
        title: "Interest-Based Negotiation",
        summary:
          "From Fisher and Ury's 'Getting to Yes': focus on underlying interests, not positions. When someone asks for a raise, the position is 'I want more money,' but the interest might be feeling valued, career progression, market fairness, or financial stress. Before discussing numbers, understand the 'why': 'Help me understand what's driving this — I want to make sure we address the real thing.' Often, a title change, public recognition, a growth opportunity, or a clear promotion timeline addresses the underlying need more effectively than the number alone.",
        framework: "Getting to Yes",
      },
      {
        title: "Transparency Within Constraints",
        summary:
          "Most managers can't share exact compensation data, but you can always explain the process. People accept outcomes they disagree with when they believe the process was fair. Share what you can: 'Here's how compensation decisions are made in our org,' 'Here's where you fall in the band for your level,' 'Here's specifically what would need to happen for an adjustment.' When you can't give the answer they want, give them a clear path: 'Here are the three things that would strengthen your case for the next cycle.'",
      },
    ],
  },
  {
    id: "cross-functional-conflict",
    title: "Cross-Functional Conflict",
    description:
      "Navigate disagreements between teams or departments without taking sides",
    icon: "shield",
    color: "accent-amber",
    learningConcepts: [
      {
        title: "DESC Conflict Resolution",
        summary:
          "The DESC model gives you a four-step script for addressing conflict without escalating it: Describe the situation objectively ('In the last two sprints, three handoffs between our teams were delayed'), Express the impact on your team ('This caused our release to slip and put the team under weekend pressure'), Specify the change you need ('I'd like us to agree on a 48-hour handoff SLA'), and outline the Consequences of resolving it ('This would eliminate the last-minute crunches for both teams'). It stays fact-based rather than emotional, which prevents the conversation from becoming personal.",
        framework: "DESC Model",
      },
      {
        title: "Active Listening",
        summary:
          "In conflict, most people listen to respond, not to understand. The single most powerful de-escalation technique is reflecting back what you hear before offering your perspective. Use the phrase: 'So what I'm hearing is...' and paraphrase their point. Then ask: 'Did I get that right?' This takes 30 seconds and accomplishes three things: it proves you listened, it slows the conversation down, and it often reveals that the disagreement is smaller than it seemed. Only after they confirm you understood should you share your view.",
      },
    ],
  },
  {
    id: "onboarding-new-hire",
    title: "Onboarding a New Hire",
    description:
      "Set expectations, build rapport, and create a strong foundation in the first conversation",
    icon: "users",
    color: "accent-green",
    learningConcepts: [
      {
        title: "Expectations Setting",
        summary:
          "The 30-60-90 day plan creates shared clarity about what success looks like. At 30 days: learn the codebase, meet the team, ship a small PR. At 60 days: own a feature, contribute to sprint planning, start giving code reviews. At 90 days: lead a project, mentor newer team members, propose process improvements. Beyond milestones, make implicit expectations explicit: 'Here's how I prefer to communicate,' 'Here's how I give feedback,' 'Here's what to do when you're blocked.' The things that feel obvious to you are invisible to someone new.",
        framework: "30-60-90 Plan",
      },
      {
        title: "Psychological Safety",
        summary:
          "Amy Edmondson's research shows that the first two weeks determine whether a new hire will ask for help or suffer in silence. Signal safety explicitly: 'There are no bad questions here,' 'I'd rather you ask me ten times than struggle alone,' 'It took me six months to feel comfortable in this codebase.' Share your own learning moments — when you made a mistake, when you didn't know something. Model the vulnerability you want them to feel safe showing. And when they do ask a question, respond with enthusiasm, not impatience. Your reaction in that moment sets the tone for their entire tenure.",
        framework: "Amy Edmondson's Framework",
      },
    ],
  },
  {
    id: "interview-hiring",
    title: "Interview (Hiring)",
    description:
      "Run structured, equitable interviews that surface the best candidate signal",
    icon: "users",
    color: "accent-blue",
    learningConcepts: [
      {
        title: "Behavioral Interviewing",
        summary:
          "The STAR method (Situation, Task, Action, Result) is both a framework for candidates and a probing tool for interviewers. Ask 'Tell me about a time when...' instead of hypotheticals like 'What would you do if...' — past behavior predicts future behavior far better than good intentions. When answers are vague, probe deeper: 'What was your specific role?' 'What did you personally do versus the team?' 'What was the measurable outcome?' 'What would you do differently?' The depth of their answers reveals whether they were a driver or a passenger.",
        framework: "STAR Method",
      },
      {
        title: "Structured Evaluation",
        summary:
          "Write down your evaluation immediately after each interview — memory degrades within hours. Score candidates on predefined criteria (technical skill, communication, problem-solving, culture contribution) using a consistent rubric. Critical: compare each candidate to the rubric, not to each other. This reduces recency bias, halo effect, and similarity bias. Share your written evaluation before the debrief meeting so groupthink doesn't override individual signal. The interview process should be as rigorous as the work you're hiring for.",
      },
    ],
  },
  {
    id: "difficult-performance",
    title: "Difficult Performance Conversations",
    description:
      "Navigate PIPs, reassignments, or terminations with clarity, compassion, and dignity",
    icon: "alert",
    color: "accent-red",
    learningConcepts: [
      {
        title: "Progressive Accountability",
        summary:
          "Jonathan Raymond's Accountability Dial defines five escalating stages: Mention (casual, in-the-moment: 'Hey, I noticed X'), Invitation (private, curious: 'Can we talk about a pattern I'm seeing?'), Conversation (formal, direct: 'This needs to change, and here's the plan'), Boundary (consequences: 'If this doesn't improve by [date], we'll need to [action]'), and Limit (final: 'We've reached the point where...'). A PIP should never be a surprise — by the time you're there, you should be at the Boundary stage. Each step documents the pattern and gives the person a fair chance to course-correct.",
        framework: "Accountability Dial",
      },
      {
        title: "Compassionate Directness",
        summary:
          "In difficult conversations, managers often soften the message so much that the person walks out unclear about what just happened. Lead with the decision, then show compassion — not the other way around. Say 'We've made the decision to place you on a performance improvement plan' followed by 'I want to make sure you're supported through this and that you have every resource to succeed.' Don't bury the message in a compliment sandwich. Respect means honesty. The kindest thing you can do is be clear about where things stand and what needs to happen next.",
      },
    ],
  },
];
