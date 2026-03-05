import { auth } from "@/auth";
import { getDb } from "@/lib/db";
import { coachingSessions } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";

// GET /api/sessions/[id] — Get a single coaching session
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const [result] = await getDb()
    .select()
    .from(coachingSessions)
    .where(
      and(
        eq(coachingSessions.id, id),
        eq(coachingSessions.userId, session.user.id)
      )
    );

  if (!result) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(result);
}
