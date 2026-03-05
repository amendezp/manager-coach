import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getDb } from "@/lib/db";
import { documents, documentChunks } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { chunkText } from "@/lib/rag/chunk";
import { generateEmbeddings } from "@/lib/rag/embed";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_EXTENSIONS = ["pdf", "pptx"];

/**
 * POST /api/documents — Upload and process a document.
 */
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate extension
    const ext = file.name.split(".").pop()?.toLowerCase() || "";
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return NextResponse.json(
        { error: "Only PDF and PPTX files are supported" },
        { status: 400 }
      );
    }

    // Validate size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File must be under 10MB" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const db = getDb();

    // Insert document record (processing state)
    const [doc] = await db
      .insert(documents)
      .values({
        userId: session.user.id,
        filename: file.name,
        fileType: ext,
        fileSize: file.size,
        status: "processing",
      })
      .returning();

    try {
      // Parse text from document
      let text: string;

      if (ext === "pdf") {
        // Import from lib/ directly to bypass index.js test-file bug
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const pdfParse = require("pdf-parse/lib/pdf-parse") as (
          buf: Buffer
        ) => Promise<{ text: string }>;
        const result = await pdfParse(buffer);
        text = result.text;
      } else {
        // officeparser exports parseOffice (async, accepts Buffer)
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const { parseOffice } = require("officeparser") as {
          parseOffice: (buf: Buffer) => Promise<string>;
        };
        text = await parseOffice(buffer);
      }

      if (!text || text.trim().length < 50) {
        await db
          .update(documents)
          .set({
            status: "error",
            errorMessage:
              "Could not extract enough text from this file. It may be scanned or image-based.",
          })
          .where(eq(documents.id, doc.id));

        return NextResponse.json(
          {
            id: doc.id,
            error: "Could not extract text from file",
          },
          { status: 422 }
        );
      }

      // Chunk the text
      const chunks = chunkText(text);

      if (chunks.length === 0) {
        await db
          .update(documents)
          .set({ status: "error", errorMessage: "No content to chunk" })
          .where(eq(documents.id, doc.id));

        return NextResponse.json(
          { id: doc.id, error: "No content found" },
          { status: 422 }
        );
      }

      // Generate embeddings for all chunks in one batch
      const embeddings = await generateEmbeddings(
        chunks.map((c) => c.content)
      );

      // Insert all chunks with their embeddings
      await db.insert(documentChunks).values(
        chunks.map((chunk, i) => ({
          documentId: doc.id,
          userId: session.user!.id!,
          content: chunk.content,
          chunkIndex: chunk.chunkIndex,
          pageNumber: chunk.pageNumber ?? null,
          embedding: embeddings[i],
        }))
      );

      // Update document status to ready
      await db
        .update(documents)
        .set({ status: "ready", chunkCount: chunks.length })
        .where(eq(documents.id, doc.id));

      return NextResponse.json({
        id: doc.id,
        filename: file.name,
        chunkCount: chunks.length,
      });
    } catch (processingError) {
      // Mark document as errored
      const message =
        processingError instanceof Error
          ? processingError.message
          : "Processing failed";
      await db
        .update(documents)
        .set({ status: "error", errorMessage: message })
        .where(eq(documents.id, doc.id));

      console.error("Document processing error:", processingError);
      return NextResponse.json(
        { id: doc.id, error: "Failed to process document" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Document upload error:", error);
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/documents — List all documents for the current user.
 */
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getDb();
  const docs = await db
    .select({
      id: documents.id,
      filename: documents.filename,
      fileType: documents.fileType,
      fileSize: documents.fileSize,
      chunkCount: documents.chunkCount,
      status: documents.status,
      errorMessage: documents.errorMessage,
      createdAt: documents.createdAt,
    })
    .from(documents)
    .where(eq(documents.userId, session.user.id))
    .orderBy(desc(documents.createdAt));

  return NextResponse.json(docs);
}
