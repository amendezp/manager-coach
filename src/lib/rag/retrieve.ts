/**
 * RAG retrieval — vector search against uploaded documents.
 *
 * Uses pgvector cosine similarity to find the most relevant chunks
 * from a user's uploaded reference materials.
 */

import { sql } from "drizzle-orm";
import { getDb } from "../db";
import { generateQueryEmbedding } from "./embed";
import type { WizardContext } from "../types";

export interface RetrievedChunk {
  content: string;
  chunkIndex: number;
  pageNumber: number | null;
  filename: string;
  similarity: number;
}

/**
 * Build a semantically rich query from the conversation context.
 * Combines multiple signals to maximize retrieval relevance.
 */
export function buildRetrievalQuery(
  context: WizardContext,
  recentMessage?: string
): string {
  const parts: string[] = [];

  if (context.template?.title) {
    parts.push(context.template.title);
  }

  if (context.template?.learningConcepts) {
    parts.push(
      context.template.learningConcepts.map((c) => c.title).join(", ")
    );
  }

  if (context.interactionNature) {
    parts.push(context.interactionNature);
  }

  if (context.desiredOutcome) {
    parts.push(context.desiredOutcome);
  }

  if (context.additionalContext) {
    // Take first 200 chars to avoid over-diluting the query
    parts.push(context.additionalContext.slice(0, 200));
  }

  if (recentMessage) {
    // Take first 200 chars of the latest message
    parts.push(recentMessage.slice(0, 200));
  }

  return parts.filter(Boolean).join(". ");
}

/**
 * Retrieve the top-K most relevant chunks from a user's documents.
 */
export async function retrieveRelevantChunks(
  userId: string,
  queryText: string,
  topK: number = 5
): Promise<RetrievedChunk[]> {
  if (!queryText.trim()) return [];

  // Check if user has any documents first (skip embedding call if not)
  const db = getDb();
  const docCount = await db.execute(
    sql`SELECT COUNT(*) as count FROM document WHERE "userId" = ${userId} AND status = 'ready'`
  );

  const count = Number(
    (docCount.rows[0] as Record<string, unknown>)?.count ?? 0
  );
  if (count === 0) return [];

  // Generate embedding for the query
  const queryEmbedding = await generateQueryEmbedding(queryText);
  const embeddingStr = `[${queryEmbedding.join(",")}]`;

  // Vector similarity search
  const results = await db.execute(
    sql`
      SELECT
        dc.content,
        dc."chunkIndex",
        dc."pageNumber",
        d.filename,
        1 - (dc.embedding <=> ${embeddingStr}::vector) AS similarity
      FROM document_chunk dc
      JOIN document d ON dc."documentId" = d.id
      WHERE dc."userId" = ${userId}
        AND d.status = 'ready'
      ORDER BY dc.embedding <=> ${embeddingStr}::vector
      LIMIT ${topK}
    `
  );

  return (results.rows as Record<string, unknown>[]).map((row) => ({
    content: row.content as string,
    chunkIndex: row.chunkIndex as number,
    pageNumber: row.pageNumber as number | null,
    filename: row.filename as string,
    similarity: Number(row.similarity),
  }));
}

/**
 * Format retrieved chunks into a string for prompt injection.
 */
export function formatChunksForPrompt(chunks: RetrievedChunk[]): string {
  if (chunks.length === 0) return "";

  return chunks
    .map(
      (c, i) =>
        `[Source: ${c.filename}${c.pageNumber ? `, p.${c.pageNumber}` : ""}, section ${c.chunkIndex + 1}]\n${c.content}`
    )
    .join("\n\n---\n\n");
}
