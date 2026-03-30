import Anthropic from "@anthropic-ai/sdk";
import { auth } from "@/auth";
import { getDb } from "@/lib/db";
import { coachingSessions } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { buildRehearsalPrompt } from "@/lib/prompts/wizard";
import { buildDebriefPrompt } from "@/lib/prompts/debrief";
import {
  buildRetrievalQuery,
  retrieveRelevantChunks,
  formatChunksForPrompt,
} from "@/lib/rag/retrieve";
import type { WizardContext } from "@/lib/types";

const anthropic = new Anthropic();

export async function POST(req: Request) {
  const { messages, flow, context } = await req.json();

  // ── RAG retrieval for wizard/debrief flows ──
  let ragContext = "";

  if ((flow === "wizard" || flow === "debrief") && context) {
    try {
      const session = await auth();
      if (session?.user?.id) {
        const lastUserMsg = [...messages]
          .reverse()
          .find((m: { role: string }) => m.role === "user");
        const queryText = buildRetrievalQuery(
          context as WizardContext,
          lastUserMsg?.content
        );
        const chunks = await retrieveRelevantChunks(
          session.user.id,
          queryText,
          5
        );
        ragContext = formatChunksForPrompt(chunks);
      }
    } catch (err) {
      // RAG failure should not block the chat — graceful degradation
      console.error("RAG retrieval error (non-blocking):", err);
    }
  }

  // ── Fetch past sessions for team member context ──
  let pastSessionSummaries = "";

  if ((flow === "wizard" || flow === "debrief") && context?.teamMemberId) {
    try {
      const session = await auth();
      if (session?.user?.id) {
        const pastSessions = await getDb()
          .select({
            templateTitle: coachingSessions.templateTitle,
            context: coachingSessions.context,
            debriefContent: coachingSessions.debriefContent,
            postSessionNotes: coachingSessions.postSessionNotes,
            createdAt: coachingSessions.createdAt,
          })
          .from(coachingSessions)
          .where(
            and(
              eq(coachingSessions.teamMemberId, context.teamMemberId as string),
              eq(coachingSessions.userId, session.user.id)
            )
          )
          .orderBy(desc(coachingSessions.createdAt))
          .limit(5);

        if (pastSessions.length > 0) {
          pastSessionSummaries = pastSessions
            .map((s) => {
              const ctx = s.context as WizardContext | null;
              const date = new Date(s.createdAt).toLocaleDateString();
              const debrief = s.debriefContent
                ? s.debriefContent.slice(0, 500) + (s.debriefContent.length > 500 ? "..." : "")
                : "No prep sheet generated";
              const notesLine = s.postSessionNotes
                ? `\n- Manager's post-session notes: ${s.postSessionNotes.slice(0, 500)}${s.postSessionNotes.length > 500 ? "..." : ""}`
                : "";
              return `### ${s.templateTitle || "Session"} (${date})\n- Goal: ${ctx?.desiredOutcome || "Not specified"}\n- Context: ${ctx?.additionalContext || "None"}${notesLine}\n- Prep sheet excerpt: ${debrief}`;
            })
            .join("\n\n");
        }
      }
    } catch (err) {
      console.error("Past sessions fetch error (non-blocking):", err);
    }
  }

  // ── Build system prompt ──
  let systemPrompt: string;

  if (flow === "wizard" && context) {
    systemPrompt = buildRehearsalPrompt(context as WizardContext, ragContext, pastSessionSummaries || undefined);
  } else if (flow === "debrief" && context) {
    systemPrompt = buildDebriefPrompt(context as WizardContext, ragContext, pastSessionSummaries || undefined);
  } else {
    // Only wizard and debrief flows are supported
    systemPrompt = buildRehearsalPrompt(
      (context as WizardContext) || { template: null, interactionNature: "", attendees: "", desiredOutcome: "", dateTime: "", additionalContext: "" },
      ragContext
    );
  }

  const stream = anthropic.messages.stream({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    system: systemPrompt,
    messages: messages.map((m: { role: string; content: string }) => ({
      role: m.role,
      content: m.content,
    })),
  });

  const encoder = new TextEncoder();

  const readableStream = new ReadableStream({
    async start(controller) {
      for await (const event of stream) {
        if (
          event.type === "content_block_delta" &&
          event.delta.type === "text_delta"
        ) {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ text: event.delta.text })}\n\n`
            )
          );
        }
      }
      controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      controller.close();
    },
  });

  return new Response(readableStream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
