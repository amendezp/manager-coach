import type { WizardContext } from "../types";

export function buildDebriefPrompt(context: WizardContext, ragContext?: string, pastSessionSummaries?: string): string {
  const templateName = context.template?.title || "a management conversation";

  const ragSection = ragContext
    ? `\n\n## Reference Materials\nIncorporate relevant insights from these organizational reference materials into your prep sheet, particularly in the Key Questions and Conversation Structure sections:\n\n${ragContext}\n`
    : "";

  return `You are generating a structured preparation document for a middle manager who has just completed a coaching rehearsal for an upcoming crucial conversation.

## Context
- **Type of conversation**: ${templateName}
- **Who is involved**: ${context.attendees || "Not specified"}
- **Desired outcome**: ${context.desiredOutcome || "Not specified"}
- **When**: ${context.dateTime || "Not specified"}
- **Nature of the interaction**: ${context.interactionNature || "Not specified"}
- **Additional context**: ${context.additionalContext || "None provided"}${ragSection}
${pastSessionSummaries ? `
## Previous Sessions With This Person
${pastSessionSummaries}

When generating the prep sheet, incorporate relevant patterns and progress from past sessions. Reference what was discussed before and how goals have evolved.
` : ""}
## Your Task

Based on the rehearsal conversation that was just completed (provided in the messages), generate a comprehensive preparation document. The manager will use this as their reference going into the real conversation.

**IMPORTANT**: You MUST always generate the full prep sheet, even if the rehearsal was very brief or minimal. When the rehearsal lacks depth, use the conversation type, attendees, and context provided above to generate best-practice guidance specific to this type of conversation. Draw on established management and coaching frameworks relevant to "${templateName}" conversations. Never refuse to generate the document or ask the user for more information — always produce actionable, useful content.

Structure the document with these EXACT sections:

## Conversation Prep Sheet

### Meeting Agenda
Provide a numbered list of topics to cover in recommended order. Include approximate time allocations if the meeting duration is known. Start with rapport-building, then move through the core topics, and end with clear next steps.

### Opening Statement
Write 2-3 sentences the manager can use to open the conversation. This should set the right tone and frame the discussion. Make it sound natural, not scripted.

### Key Questions to Ask
List 5-7 powerful, open-ended questions the manager should ask during the conversation. Base these on the coaching frameworks discussed and the specific situation. Order them from opening to deeper exploration.

### Conversation Structure
Provide a recommended flow for the conversation:
1. **Opening** (how to set the tone)
2. **Core discussion** (how to structure the main points)
3. **Difficult moments** (how to handle likely pushback or emotions)
4. **Closing** (how to end with clarity and commitment)

### Things Not to Forget
A checklist of important reminders:
- Potential landmines to avoid
- Key phrases that worked well in rehearsal
- Body language and tone reminders
- Follow-up commitments to make
- Documentation needs

### If Things Go Sideways
Brief guidance on what to do if the conversation takes an unexpected turn — how to redirect, when to pause, and when to reschedule.

## Formatting Rules
- Use clear headers and bullet points for scanability
- Keep each section concise and actionable
- Include specific language suggestions (exact phrases) where possible
- Reference insights from the rehearsal conversation
- Make it printable — clean formatting, no excessive decoration`;
}
