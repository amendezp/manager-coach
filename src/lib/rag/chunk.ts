/**
 * Paragraph-aware text chunking for RAG.
 *
 * Splits extracted document text into overlapping chunks that try to keep
 * complete paragraphs together. This preserves the structure of management
 * frameworks and best-practice descriptions.
 */

export interface TextChunk {
  content: string;
  chunkIndex: number;
  pageNumber?: number;
}

const TARGET_CHUNK_SIZE = 1000; // characters — target chunk length
const MAX_CHUNK_SIZE = 1500; // characters — hard upper limit
const OVERLAP_SIZE = 100; // characters — overlap between chunks

/**
 * Chunk a document's text into overlapping segments.
 *
 * 1. Split by double-newline to get paragraphs
 * 2. Merge consecutive paragraphs into chunks of ~TARGET_CHUNK_SIZE
 * 3. Add OVERLAP_SIZE chars from previous chunk's tail
 * 4. Long paragraphs are split at sentence boundaries
 */
export function chunkText(text: string): TextChunk[] {
  const paragraphs = text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  if (paragraphs.length === 0) return [];

  const chunks: TextChunk[] = [];
  let currentChunk = "";
  let chunkIndex = 0;

  const flushChunk = () => {
    if (currentChunk.trim()) {
      chunks.push({ content: currentChunk.trim(), chunkIndex: chunkIndex++ });
    }
  };

  for (const paragraph of paragraphs) {
    // If a single paragraph exceeds MAX, split it at sentence boundaries
    if (paragraph.length > MAX_CHUNK_SIZE) {
      flushChunk();
      const overlap = currentChunk.slice(-OVERLAP_SIZE);

      const sentences = paragraph.match(/[^.!?]+[.!?]+\s*/g) || [paragraph];
      currentChunk = overlap;

      for (const sentence of sentences) {
        if (
          (currentChunk + sentence).length > MAX_CHUNK_SIZE &&
          currentChunk.trim()
        ) {
          flushChunk();
          currentChunk = currentChunk.slice(-OVERLAP_SIZE);
        }
        currentChunk += sentence;
      }
      continue;
    }

    // Check if adding this paragraph would exceed the target
    const combined = currentChunk
      ? currentChunk + "\n\n" + paragraph
      : paragraph;

    if (combined.length > TARGET_CHUNK_SIZE && currentChunk.trim()) {
      flushChunk();
      // Start new chunk with overlap from previous
      const overlap = currentChunk.slice(-OVERLAP_SIZE);
      currentChunk = overlap ? overlap + "\n\n" + paragraph : paragraph;
    } else {
      currentChunk = combined;
    }
  }

  // Don't forget the last chunk
  flushChunk();

  return chunks;
}
