/**
 * OpenAI embedding wrapper for RAG.
 *
 * Uses text-embedding-3-small (1536 dimensions) — high quality at $0.02/1M tokens.
 */

import OpenAI from "openai";

let _openai: OpenAI | null = null;

function getOpenAI(): OpenAI {
  if (!_openai) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY environment variable is not set");
    }
    _openai = new OpenAI();
  }
  return _openai;
}

/**
 * Generate embeddings for multiple texts in a single API call.
 * Returns an array of 1536-dimensional float arrays.
 */
export async function generateEmbeddings(
  texts: string[]
): Promise<number[][]> {
  if (texts.length === 0) return [];

  const openai = getOpenAI();
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: texts,
  });

  // Return in the same order as input
  return response.data
    .sort((a, b) => a.index - b.index)
    .map((d) => d.embedding);
}

/**
 * Generate a single embedding for a query string.
 */
export async function generateQueryEmbedding(
  text: string
): Promise<number[]> {
  const [embedding] = await generateEmbeddings([text]);
  return embedding;
}
