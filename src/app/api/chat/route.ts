import Anthropic from "@anthropic-ai/sdk";
import { COPILOT_SYSTEM_PROMPT } from "@/lib/prompts/copilot";
import { SIMULATOR_SYSTEM_PROMPT } from "@/lib/prompts/simulator";
import { REFLECT_SYSTEM_PROMPT } from "@/lib/prompts/reflect";
import type { FlowType } from "@/lib/types";

const anthropic = new Anthropic();

const PROMPTS: Record<FlowType, string> = {
  copilot: COPILOT_SYSTEM_PROMPT,
  simulator: SIMULATOR_SYSTEM_PROMPT,
  reflect: REFLECT_SYSTEM_PROMPT,
};

export async function POST(req: Request) {
  const { messages, flow } = await req.json();

  const systemPrompt = PROMPTS[flow as FlowType] || PROMPTS.copilot;

  const stream = anthropic.messages.stream({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2048,
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
