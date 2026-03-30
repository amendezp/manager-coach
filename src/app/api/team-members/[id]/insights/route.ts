import Anthropic from "@anthropic-ai/sdk";
import { auth } from "@/auth";
import { getDb } from "@/lib/db";
import { teamMembers, coachingSessions } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { NextResponse } from "next/server";
import type { WizardContext } from "@/lib/types";

const anthropic = new Anthropic();

// POST /api/team-members/:id/insights — Generate AI insights from session notes
export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  // Verify ownership
  const [member] = await getDb()
    .select({ id: teamMembers.id, name: teamMembers.name, role: teamMembers.role, notes: teamMembers.notes })
    .from(teamMembers)
    .where(and(eq(teamMembers.id, id), eq(teamMembers.userId, session.user.id)));

  if (!member) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Fetch sessions with notes
  const sessions = await getDb()
    .select({
      templateTitle: coachingSessions.templateTitle,
      context: coachingSessions.context,
      postSessionNotes: coachingSessions.postSessionNotes,
      createdAt: coachingSessions.createdAt,
    })
    .from(coachingSessions)
    .where(
      and(
        eq(coachingSessions.teamMemberId, id),
        eq(coachingSessions.userId, session.user.id)
      )
    )
    .orderBy(desc(coachingSessions.createdAt))
    .limit(20);

  // Build context for Claude
  const sessionsWithNotes = sessions.filter((s) => s.postSessionNotes);

  if (sessionsWithNotes.length === 0) {
    return NextResponse.json({
      insights: null,
      reason: "no_notes",
    });
  }

  const sessionSummaries = sessionsWithNotes
    .map((s) => {
      const ctx = s.context as WizardContext | null;
      const date = new Date(s.createdAt).toLocaleDateString();
      return `### ${s.templateTitle || "Session"} (${date})
- Goal: ${ctx?.desiredOutcome || "Not specified"}
- Post-session notes: ${s.postSessionNotes}`;
    })
    .join("\n\n");

  const prompt = `You are analyzing a manager's coaching session notes about their team member "${member.name}"${member.role ? ` (${member.role})` : ""}.
${member.notes ? `\nManager's general notes about this person: ${member.notes}\n` : ""}
Here are the post-session notes from their coaching sessions:

${sessionSummaries}

Based on these notes, generate a concise insights summary with these sections:

## Key Patterns
2-3 recurring themes or patterns you notice across sessions (e.g., communication style, areas of growth, recurring challenges)

## Follow-Up Items
Action items or topics the manager should follow up on based on their notes

## Coaching Suggestions
2-3 specific suggestions for the next coaching conversation with this person, informed by the patterns you see

Keep each section brief (2-4 bullet points). Be specific — reference actual content from the notes. Write in second person ("You mentioned...", "Consider...").`;

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    messages: [{ role: "user", content: prompt }],
  });

  const insights =
    response.content[0].type === "text" ? response.content[0].text : "";

  return NextResponse.json({ insights });
}
