import { auth } from "@/auth";
import { getDb } from "@/lib/db";
import { teamMembers, coachingSessions } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { NextResponse } from "next/server";

// GET /api/team-members/:id — Get a team member with their session history
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const [member] = await getDb()
    .select()
    .from(teamMembers)
    .where(
      and(eq(teamMembers.id, id), eq(teamMembers.userId, session.user.id))
    );

  if (!member) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const sessions = await getDb()
    .select({
      id: coachingSessions.id,
      templateTitle: coachingSessions.templateTitle,
      context: coachingSessions.context,
      createdAt: coachingSessions.createdAt,
    })
    .from(coachingSessions)
    .where(eq(coachingSessions.teamMemberId, id))
    .orderBy(desc(coachingSessions.createdAt));

  return NextResponse.json({ ...member, sessions });
}

// PUT /api/team-members/:id — Update a team member
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const { name, email, role, notes } = body;

  const updates: Record<string, unknown> = { updatedAt: new Date() };
  if (name !== undefined) updates.name = name.trim();
  if (email !== undefined) updates.email = email?.trim() || null;
  if (role !== undefined) updates.role = role?.trim() || null;
  if (notes !== undefined) updates.notes = notes?.trim() || null;

  const [updated] = await getDb()
    .update(teamMembers)
    .set(updates)
    .where(
      and(eq(teamMembers.id, id), eq(teamMembers.userId, session.user.id))
    )
    .returning();

  if (!updated) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(updated);
}

// DELETE /api/team-members/:id — Delete a team member
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const deleted = await getDb()
    .delete(teamMembers)
    .where(
      and(eq(teamMembers.id, id), eq(teamMembers.userId, session.user.id))
    )
    .returning({ id: teamMembers.id });

  if (deleted.length === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
