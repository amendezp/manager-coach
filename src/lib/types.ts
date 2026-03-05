export type FlowType = "copilot" | "simulator" | "reflect" | "wizard" | "debrief";

export type WizardStep = 1 | 2 | 3 | 4 | 5 | 6;

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
  learningConcepts: LearningConcept[];
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  attendees: string[];
}

export interface WizardContext {
  calendarEvent?: CalendarEvent | null;
  template: CoachableTemplate | null;
  interactionNature: string;
  attendees: string;
  desiredOutcome: string;
  dateTime: string;
  additionalContext: string;
}
