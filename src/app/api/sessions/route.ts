import { auth } from "@/auth";
import { getDb } from "@/lib/db";
import { coachingSessions } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { NextResponse } from "next/server";

// POST /api/sessions — Save a new coaching session
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { templateId, templateTitle, context, chatMessages, debriefContent, teamMemberId } =
    body;

  const [saved] = await getDb()
    .insert(coachingSessions)
    .values({
      userId: session.user.id,
      teamMemberId: teamMemberId || null,
      templateId,
      templateTitle,
      context,
      chatMessages,
      debriefContent,
    })
    .returning({ id: coachingSessions.id });

  return NextResponse.json({ id: saved.id });
}

// GET /api/sessions — List all sessions for the current user
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sessions = await getDb()
    .select({
      id: coachingSessions.id,
      templateId: coachingSessions.templateId,
      templateTitle: coachingSessions.templateTitle,
      context: coachingSessions.context,
      createdAt: coachingSessions.createdAt,
      updatedAt: coachingSessions.updatedAt,
    })
    .from(coachingSessions)
    .where(eq(coachingSessions.userId, session.user.id))
    .orderBy(desc(coachingSessions.createdAt));

  return NextResponse.json(sessions);
}
