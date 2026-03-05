"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import ChatInterface from "../ChatInterface";
import { ChatBubbleIcon } from "../Icons";
import type { Message, WizardContext } from "@/lib/types";

export default function StepRehearsal({
  context,
  messages,
  onMessagesChange,
  feedbackRequested,
  onRequestFeedback,
}: {
  context: WizardContext;
  messages: Message[];
  onMessagesChange: (messages: Message[]) => void;
  feedbackRequested: boolean;
  onRequestFeedback: () => void;
}) {
  const [showFeedbackConfirm, setShowFeedbackConfirm] = useState(false);
  const [autoSendDone, setAutoSendDone] = useState(false);
  const sendFnRef = useRef<((content: string) => void) | null>(null);

  const handleSendReady = useCallback(
    (sendFn: (content: string) => void) => {
      sendFnRef.current = sendFn;
    },
    []
  );

  // Auto-send initial message to trigger the AI's opening when rehearsal starts.
  // Uses state (not ref) to survive React strict mode's double-mount cycle.
  useEffect(() => {
    if (autoSendDone || messages.length > 0) return;

    let sent = false;
    const timer = setInterval(() => {
      if (sendFnRef.current && !sent) {
        sent = true;
        setAutoSendDone(true);
        sendFnRef.current(
          "I'm ready to start the rehearsal. Please review my context and help me prepare."
        );
      }
    }, 400);

    return () => clearInterval(timer);
  }, [autoSendDone, messages.length]);

  const handleFeedbackRequest = useCallback(() => {
    onRequestFeedback();
    // Trigger the feedback request through the chat
    if (sendFnRef.current) {
      sendFnRef.current(
        "[FEEDBACK_REQUEST] Please end the rehearsal and provide your structured feedback now. Show what I did well and what could improve."
      );
    }
  }, [onRequestFeedback]);

  // Check if there are enough messages to show feedback button (at least 2 user messages)
  const userMessageCount = messages.filter((m) => m.role === "user").length;
  const canRequestFeedback = userMessageCount >= 2 && !feedbackRequested;

  const feedbackControls = !feedbackRequested ? (
    <div className="px-4 py-2 bg-surface/80 backdrop-blur-lg">
      <div className="max-w-3xl mx-auto">
        {showFeedbackConfirm ? (
          <div className="flex items-center justify-center gap-3 animate-fade-up-sm">
            <span className="text-xs text-text-secondary">
              End rehearsal and see your feedback?
            </span>
            <button
              onClick={() => {
                handleFeedbackRequest();
                setShowFeedbackConfirm(false);
              }}
              className="px-4 py-1.5 rounded-lg text-xs font-semibold gradient-brand text-white shadow-sm hover:shadow-md transition-all active:scale-95"
            >
              Yes, show feedback
            </button>
            <button
              onClick={() => setShowFeedbackConfirm(false)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-text-tertiary hover:text-text-secondary hover:bg-surface-tertiary transition-all"
            >
              Keep going
            </button>
          </div>
        ) : canRequestFeedback ? (
          <button
            onClick={() => setShowFeedbackConfirm(true)}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-medium text-brand-600 bg-brand-50 hover:bg-brand-100 border border-brand-100 hover:border-brand-200 transition-all duration-200"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
            I&apos;m ready — show me feedback
          </button>
        ) : null}
      </div>
    </div>
  ) : null;

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <ChatInterface
        flow="wizard"
        title="Rehearsal"
        subtitle="Practice your conversation"
        icon={<ChatBubbleIcon className="w-[18px] h-[18px] text-white" />}
        placeholder="Type your response..."
        hideHeader
        autoStart
        controlledMessages={messages}
        onMessagesChange={onMessagesChange}
        extraContext={context as unknown as Record<string, unknown>}
        extraControls={feedbackControls}
        onSendReady={handleSendReady}
      />
    </div>
  );
}
