"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  SparklesIcon,
  DocumentIcon,
  ClipboardDocIcon,
  PrinterIcon,
  ArrowRightIcon,
} from "@/components/Icons";

interface SessionDetail {
  id: string;
  templateTitle: string | null;
  context: {
    attendees?: string;
    desiredOutcome?: string;
    template?: { title?: string };
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
      <div className="min-h-dvh bg-surface-secondary flex items-center justify-center">
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
      <div className="min-h-dvh bg-surface-secondary flex flex-col items-center justify-center px-4">
        <h2 className="text-xl font-bold text-text-primary mb-2">
          Session not found
        </h2>
        <p className="text-sm text-text-secondary mb-6">
          This session may have been deleted or doesn&apos;t exist.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-brand text-white font-semibold text-sm"
        >
          Back to Dashboard
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
    <div className="min-h-dvh bg-surface-secondary">
      {/* Header */}
      <header className="border-b border-border/60 bg-surface/70 backdrop-blur-xl px-4 py-3 print:hidden">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl gradient-brand flex items-center justify-center shadow-sm shadow-brand-200/30">
              <SparklesIcon className="w-[18px] h-[18px] text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-text-primary tracking-tight">
                AI Coach
              </h1>
              <p className="text-[11px] text-text-tertiary leading-tight">
                Leadership coaching for middle managers
              </p>
            </div>
          </Link>

          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-surface-tertiary transition-all"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
            Dashboard
          </Link>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 pt-6 pb-12 sm:pt-8">
        {/* Debrief header */}
        <div className="flex items-center justify-between mb-6 animate-fade-up">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center shadow-md shadow-violet-200/30">
              <DocumentIcon className="w-5 h-5 text-white" />
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
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-text-secondary hover:text-text-primary bg-surface-tertiary/50 hover:bg-surface-tertiary border border-transparent hover:border-border/50 transition-all"
            >
              <ClipboardDocIcon className="w-3.5 h-3.5" />
              {copied ? "Copied!" : "Copy"}
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-text-secondary hover:text-text-primary bg-surface-tertiary/50 hover:bg-surface-tertiary border border-transparent hover:border-border/50 transition-all"
            >
              <PrinterIcon className="w-3.5 h-3.5" />
              Print
            </button>
          </div>
        </div>

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

        {/* Footer actions */}
        <div
          className="flex items-center justify-center gap-4 mt-8 animate-fade-in print:hidden"
          style={{ animationDelay: "0.3s" }}
        >
          <Link
            href="/dashboard"
            className="text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            Back to Dashboard
          </Link>
          <Link
            href="/coach"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-brand text-white font-semibold text-sm shadow-md shadow-brand-300/20 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
          >
            New Session
            <ArrowRightIcon className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
