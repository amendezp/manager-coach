"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  DocumentIcon,
  ClipboardDocIcon,
  PrinterIcon,
} from "@/components/Icons";
import MicButton from "@/components/MicButton";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";

interface SessionDetail {
  id: string;
  templateTitle: string | null;
  context: {
    attendees?: string;
    desiredOutcome?: string;
    dateTime?: string;
    additionalContext?: string;
    template?: { title?: string; color?: string };
  } | null;
  debriefContent: string | null;
  postSessionNotes: string | null;
  createdAt: string;
}

function renderDebriefMarkdown(text: string): string {
  let html = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  html = html
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, "<em>$1</em>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/^#### (.+)$/gm, "<h4>$1</h4>")
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    .replace(/^---$/gm, "<hr/>")
    .replace(/^&gt; (.+)$/gm, "<blockquote>$1</blockquote>")
    .replace(/^\d+\. (.+)$/gm, '<li class="ol-item">$1</li>')
    .replace(/^[-*] (.+)$/gm, "<li>$1</li>")
    .replace(/\n\n/g, "</p><p>")
    .replace(/\n/g, "<br/>");

  html = html.replace(
    /((?:<li>(?:(?!<li class="ol-item">).)*<\/li>(?:<br\/>)?)+)/g,
    "<ul>$1</ul>"
  );
  html = html.replace(
    /((?:<li class="ol-item">.*?<\/li>(?:<br\/>)?)+)/g,
    (match) => "<ol>" + match.replace(/ class="ol-item"/g, "") + "</ol>"
  );

  html = html.replace(/<br\/>(<\/?(ul|ol|li|h[1-4]|blockquote|div|hr))/g, "$1");
  html = html.replace(/(<\/(ul|ol|li|h[1-4]|blockquote|div|hr)>)<br\/>/g, "$1");

  return `<p>${html}</p>`;
}

export default function SessionDetailPage() {
  const params = useParams();
  const [session, setSession] = useState<SessionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [notFound, setNotFound] = useState(false);

  // Notes state
  const [notes, setNotes] = useState("");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Speech recognition for notes
  const {
    isSupported,
    isListening,
    interimTranscript,
    toggleListening,
  } = useSpeechRecognition({
    onTranscript: (transcript) => {
      setNotes((prev) => (prev ? prev + " " + transcript : transcript));
    },
  });

  const displayValue = isListening && interimTranscript
    ? (notes ? notes + " " + interimTranscript : interimTranscript)
    : notes;

  useEffect(() => {
    async function fetchSession() {
      try {
        const res = await fetch(`/api/sessions/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          setSession(data);
          setNotes(data.postSessionNotes || "");
        } else if (res.status === 404) {
          setNotFound(true);
        }
      } catch (err) {
        console.error("Failed to fetch session:", err);
      } finally {
        setLoading(false);
      }
    }
    if (params.id) fetchSession();
  }, [params.id]);

  const saveNotes = useCallback(async (value: string) => {
    if (!params.id) return;
    setSaveStatus("saving");
    try {
      const res = await fetch(`/api/sessions/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postSessionNotes: value }),
      });
      if (res.ok) {
        setSaveStatus("saved");
        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = setTimeout(() => setSaveStatus("idle"), 2000);
      }
    } catch {
      setSaveStatus("idle");
    }
  }, [params.id]);

  const handleNotesBlur = () => {
    if (notes !== (session?.postSessionNotes || "")) {
      saveNotes(notes);
    }
  };

  const handleCopy = async () => {
    if (!session?.debriefContent) return;
    await navigator.clipboard.writeText(session.debriefContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-full bg-surface-secondary flex items-center justify-center">
        <div className="thinking-dots flex items-center gap-0.5">
          <span />
          <span />
          <span />
        </div>
      </div>
    );
  }

  if (notFound || !session) {
    return (
      <div className="min-h-full bg-surface-secondary flex flex-col items-center justify-center px-4">
        <h2 className="text-xl font-bold text-text-primary mb-2">
          Session not found
        </h2>
        <p className="text-sm text-text-secondary mb-6">
          This session may have been deleted or doesn&apos;t exist.
        </p>
        <Link
          href="/coach"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-brand text-white font-semibold text-sm"
        >
          New Session
        </Link>
      </div>
    );
  }

  const createdDate = new Date(session.createdAt).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <div className="min-h-full bg-surface-secondary overflow-y-auto">
      <div className="max-w-6xl mx-auto px-4 pt-6 pb-12 sm:pt-8">
        {/* Session header */}
        <div className="flex items-center justify-between mb-6 animate-fade-up">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl accent-violet flex items-center justify-center">
              <DocumentIcon className="w-5 h-5 text-white relative z-10" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-text-primary">
                {session.templateTitle || "Coaching Session"}
              </h2>
              <p className="text-xs text-text-tertiary">
                {createdDate}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 print:hidden">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-text-secondary hover:text-text-primary bg-brand-50 hover:bg-brand-100 border border-brand-200 transition-all"
            >
              <ClipboardDocIcon className="w-3.5 h-3.5" />
              {copied ? "Copied!" : "Copy"}
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-text-secondary hover:text-text-primary bg-brand-50 hover:bg-brand-100 border border-brand-200 transition-all"
            >
              <PrinterIcon className="w-3.5 h-3.5" />
              Print
            </button>
          </div>
        </div>

        {/* Context summary */}
        {session.context && (session.context.attendees || session.context.desiredOutcome) && (
          <div
            className="mb-4 px-4 py-3 rounded-lg border border-border bg-brand-50/50 animate-fade-up"
            style={{ animationDelay: "0.05s" }}
          >
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-text-secondary">
              {session.context.attendees && (
                <span>
                  <span className="text-text-tertiary">With:</span>{" "}
                  <span className="font-medium text-text-primary">{session.context.attendees}</span>
                </span>
              )}
              {session.context.desiredOutcome && (
                <span>
                  <span className="text-text-tertiary">Goal:</span>{" "}
                  <span className="font-medium text-text-primary">{session.context.desiredOutcome}</span>
                </span>
              )}
              {session.context.dateTime && (
                <span>
                  <span className="text-text-tertiary">Date:</span>{" "}
                  <span className="font-medium text-text-primary">{session.context.dateTime}</span>
                </span>
              )}
            </div>
          </div>
        )}

        {/* Side-by-side: Prep sheet + Notes */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Prep sheet (left, 2/3 width) */}
          <div className="lg:col-span-2">
            <div
              className="debrief-artifact rounded-2xl border border-border/80 bg-surface shadow-sm p-6 sm:p-8 animate-fade-up print:shadow-none print:border-none"
              style={{ animationDelay: "0.1s" }}
            >
              {session.debriefContent ? (
                <div
                  className="prose debrief-prose"
                  dangerouslySetInnerHTML={{
                    __html: renderDebriefMarkdown(session.debriefContent),
                  }}
                />
              ) : (
                <p className="text-sm text-text-tertiary">
                  No debrief content available for this session.
                </p>
              )}
            </div>
          </div>

          {/* Notes panel (right, 1/3 width, sticky) */}
          <div className="lg:col-span-1 print:hidden">
            <div
              className="rounded-xl border border-border bg-surface p-5 animate-fade-up lg:sticky lg:top-8"
              style={{ animationDelay: "0.15s" }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-brand-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125" />
                  </svg>
                  <h3 className="text-sm font-bold text-text-primary">Session Notes</h3>
                </div>
                <div className="flex items-center gap-2">
                  {saveStatus === "saving" && (
                    <span className="text-[11px] text-text-tertiary">Saving...</span>
                  )}
                  {saveStatus === "saved" && (
                    <span className="text-[11px] text-green-600 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                      Saved
                    </span>
                  )}
                  <MicButton
                    isListening={isListening}
                    isSupported={isSupported}
                    onClick={toggleListening}
                    variant="compact"
                  />
                </div>
              </div>

              {/* Prompt when empty */}
              {!notes && !isListening && (
                <div className="mb-3 px-3 py-2.5 rounded-lg bg-amber-50 border border-amber-200">
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    Don&apos;t forget to take notes during or right after your meeting.
                    These notes will help track key events and insights for future coaching sessions.
                  </p>
                </div>
              )}

              {/* Recording indicator */}
              {isListening && (
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500" />
                  </span>
                  <span className="text-[11px] text-red-500 font-medium">Recording</span>
                </div>
              )}

              <textarea
                value={displayValue}
                onChange={(e) => {
                  if (!isListening || !interimTranscript) {
                    setNotes(e.target.value);
                  }
                }}
                onBlur={handleNotesBlur}
                placeholder="How did the conversation go? What would you do differently?"
                rows={10}
                className={`w-full px-3 py-2.5 rounded-lg border bg-surface text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-brand-700 transition-all resize-none ${
                  isListening ? "border-red-300" : "border-border"
                } ${isListening && interimTranscript ? "text-text-secondary" : ""}`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
