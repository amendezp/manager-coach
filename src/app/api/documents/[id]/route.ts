import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getDb } from "@/lib/db";
import { documents } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";

/**
 * DELETE /api/documents/[id] — Delete a document and its chunks (cascade).
 */
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const db = getDb();

  // Delete with ownership check — cascade deletes chunks
  const deleted = await db
    .delete(documents)
    .where(
      and(eq(documents.id, id), eq(documents.userId, session.user.id))
    )
    .returning({ id: documents.id });

  if (deleted.length === 0) {
    return NextResponse.json(
      { error: "Document not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true });
}
