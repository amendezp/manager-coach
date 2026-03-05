"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  DocumentIcon,
  ClipboardDocIcon,
  PrinterIcon,
} from "@/components/Icons";

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

  useEffect(() => {
    async function fetchSession() {
      try {
        const res = await fetch(`/api/sessions/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          setSession(data);
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
      <div className="max-w-3xl mx-auto px-4 pt-6 pb-12 sm:pt-8">
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

        {/* Debrief content */}
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
    </div>
  );
}
