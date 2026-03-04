export type FlowType = "copilot" | "simulator" | "reflect";

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
