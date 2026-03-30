import { auth } from "@/auth";
import { getDb } from "@/lib/db";
import { teamMembers } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";
import { NextResponse } from "next/server";

// GET /api/team-members — List all team members for the current user
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const members = await getDb()
    .select()
    .from(teamMembers)
    .where(eq(teamMembers.userId, session.user.id))
    .orderBy(asc(teamMembers.name));

  return NextResponse.json(members);
}

// POST /api/team-members — Create a new team member
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { name, email, role, notes } = body;

  if (!name || typeof name !== "string" || !name.trim()) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const [member] = await getDb()
    .insert(teamMembers)
    .values({
      userId: session.user.id,
      name: name.trim(),
      email: email?.trim() || null,
      role: role?.trim() || null,
      notes: notes?.trim() || null,
    })
    .returning();

  return NextResponse.json(member);
}
