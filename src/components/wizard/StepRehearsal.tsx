"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import ChatInterface from "../ChatInterface";
import { ChatBubbleIcon } from "../Icons";
import type { Message, WizardContext, LearningConcept } from "@/lib/types";

/* ─── Framework briefing card shown above the rehearsal chat ─── */
function FrameworkBriefing({ concepts }: { concepts: LearningConcept[] }) {
  const [collapsed, setCollapsed] = useState(false);

  if (concepts.length === 0) return null;

  return (
    <div className="rounded-xl border border-brand-200 bg-gradient-to-br from-brand-50/80 to-white overflow-hidden animate-fade-up-sm">
      <button
        type="button"
        onClick={() => setCollapsed((v) => !v)}
        className="w-full flex items-center gap-2.5 px-4 py-3 text-left hover:bg-brand-50/60 transition-colors"
      >
        <div className="w-7 h-7 rounded-lg bg-brand-100 flex items-center justify-center flex-shrink-0">
          <svg
            className="w-4 h-4 text-brand-600"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342"
            />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-brand-700">
            Frameworks to practice
          </p>
          <p className="text-[11px] text-brand-500 mt-0.5">
            {concepts.map((c) => c.title).join(" · ")}
          </p>
        </div>
        <svg
          className={`w-4 h-4 text-brand-400 transition-transform duration-200 flex-shrink-0 ${
            collapsed ? "" : "rotate-180"
          }`}
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m19.5 8.25-7.5 7.5-7.5-7.5"
          />
        </svg>
      </button>

      {!collapsed && (
        <div className="px-4 pb-4 space-y-2.5 animate-fade-up-sm">
          {concepts.map((c, i) => (
            <div
              key={c.title}
              className="flex gap-3 p-3 rounded-lg bg-white border border-brand-100"
            >
              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-brand-100 flex items-center justify-center mt-0.5">
                <span className="text-[10px] font-bold text-brand-600">
                  {i + 1}
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-text-primary">
                  {c.title}
                  {c.framework && (
                    <span className="ml-1.5 text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-brand-50 text-brand-600 border border-brand-200">
                      {c.framework}
                    </span>
                  )}
                </p>
                <p className="text-[11px] text-text-secondary leading-relaxed mt-1">
                  {c.summary}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

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
    if (sendFnRef.current) {
      sendFnRef.current(
        "[FEEDBACK_REQUEST] Please end the rehearsal and provide your structured feedback now. Show what I did well and what could improve."
      );
    }
  }, [onRequestFeedback]);

  const userMessageCount = messages.filter((m) => m.role === "user").length;
  const canRequestFeedback = userMessageCount >= 2 && !feedbackRequested;

  // Framework briefing card — shown at the top of the chat scroll area
  const frameworkBriefing = context.template?.learningConcepts?.length ? (
    <FrameworkBriefing concepts={context.template.learningConcepts} />
  ) : null;

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
              className="px-4 py-1.5 rounded-lg text-xs font-semibold gradient-brand text-white hover:opacity-90 transition-all active:scale-[0.98]"
            >
              Yes, show feedback
            </button>
            <button
              onClick={() => setShowFeedbackConfirm(false)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-text-tertiary hover:text-text-secondary hover:bg-brand-50 transition-all"
            >
              Keep going
            </button>
          </div>
        ) : canRequestFeedback ? (
          <button
            onClick={() => setShowFeedbackConfirm(true)}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-medium text-text-secondary bg-brand-50 hover:bg-brand-100 border border-brand-200 transition-all duration-200"
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
        headerContent={frameworkBriefing}
      />
    </div>
  );
}
