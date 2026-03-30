export type FlowType = "wizard" | "debrief";

export type WizardStep = 1 | 2 | 3 | 4;

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export interface ScenarioCard {
  id: string;
  title: string;
  description: string;
  icon: string;
  prompt: string;
}

export interface LearningConcept {
  title: string;
  summary: string;
  framework?: string;
}

export interface CoachableTemplate {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  learningConcepts: LearningConcept[];
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  attendees: string[];
}

export interface TeamMember {
  id: string;
  name: string;
  email: string | null;
  role: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface WizardContext {
  calendarEvent?: CalendarEvent | null;
  template: CoachableTemplate | null;
  interactionNature: string;
  attendees: string;
  teamMemberId?: string | null;
  desiredOutcome: string;
  dateTime: string;
  additionalContext: string;
}

export interface CoachingSession {
  id: string;
  userId: string;
  templateId: string | null;
  templateTitle: string | null;
  context: WizardContext;
  chatMessages: Message[];
  debriefContent: string | null;
  createdAt: Date;
  updatedAt: Date;
}
