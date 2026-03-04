"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { Message, FlowType } from "@/lib/types";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";
import FlowHeader from "./FlowHeader";

export default function ChatInterface({
  flow,
  title,
  subtitle,
  icon,
  placeholder,
  renderWelcome,
}: {
  flow: FlowType;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  placeholder: string;
  renderWelcome: (onSelectScenario: (prompt: string) => void) => React.ReactNode;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (isStreaming) return;

      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content,
        timestamp: Date.now(),
      };

      if (!sessionStarted) {
        setSessionStarted(true);
      }

      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);
      setIsStreaming(true);

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "",
        timestamp: Date.now(),
      };

      setMessages([...updatedMessages, assistantMessage]);

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            flow,
            messages: updatedMessages.map((m) => ({
              role: m.role,
              content: m.content,
            })),
          }),
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const reader = response.body?.getReader();
        if (!reader) throw new Error("No response body");

        const decoder = new TextDecoder();
        let fullText = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") continue;
              try {
                const parsed = JSON.parse(data);
                if (parsed.text) {
                  fullText += parsed.text;
                  setMessages((prev) => {
                    const updated = [...prev];
                    const last = updated[updated.length - 1];
                    if (last.role === "assistant") {
                      updated[updated.length - 1] = {
                        ...last,
                        content: fullText,
                      };
                    }
                    return updated;
                  });
                }
              } catch {
                // skip malformed JSON
              }
            }
          }
        }
      } catch (error) {
        console.error("Chat error:", error);
        setMessages((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          if (last.role === "assistant") {
            updated[updated.length - 1] = {
              ...last,
              content:
                "I encountered an error connecting to the AI. Please check that your `ANTHROPIC_API_KEY` is set correctly in `.env.local` and try again.",
            };
          }
          return updated;
        });
      } finally {
        setIsStreaming(false);
      }
    },
    [messages, isStreaming, sessionStarted, flow]
  );

  const startNewSession = useCallback(() => {
    setMessages([]);
    setSessionStarted(false);
  }, []);

  return (
    <div className="h-dvh flex flex-col bg-surface-secondary">
      <FlowHeader
        title={title}
        subtitle={subtitle}
        icon={icon}
        sessionStarted={sessionStarted}
        onNewSession={startNewSession}
      />

      {!sessionStarted ? (
        <div className="flex-1 overflow-y-auto">{renderWelcome(sendMessage)}</div>
      ) : (
        <div ref={scrollAreaRef} className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-4 py-6 space-y-5">
            {messages.map((message, i) => (
              <MessageBubble
                key={message.id}
                message={message}
                isStreaming={isStreaming && i === messages.length - 1}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
      )}

      <ChatInput
        onSend={sendMessage}
        disabled={isStreaming}
        placeholder={placeholder}
      />
    </div>
  );
}
