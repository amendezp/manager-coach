"use client";

import { useState, useEffect, useCallback } from "react";
import type { Message, WizardContext } from "@/lib/types";
import { signIn } from "next-auth/react";
import { DocumentIcon, ClipboardDocIcon, PrinterIcon } from "../Icons";
import Link from "next/link";

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

export default function StepDebrief({
  context,
  chatMessages,
  onSave,
  saveStatus = "idle",
  isGuest,
}: {
  context: WizardContext;
  chatMessages: Message[];
  onSave?: (debriefContent: string) => void;
  saveStatus?: "idle" | "saving" | "saved" | "error" | "guest";
  isGuest?: boolean;
}) {
  const [debriefContent, setDebriefContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateDebrief = useCallback(async () => {
    if (isGenerating || hasGenerated) return;
    setIsGenerating(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          flow: "debrief",
          context,
          messages: chatMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) throw new Error(`API error: ${response.status}`);

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
                setDebriefContent(fullText);
              }
            } catch {
              // skip malformed JSON
            }
          }
        }
      }

      setHasGenerated(true);
      onSave?.(fullText);
    } catch (error) {
      console.error("Debrief error:", error);
      setDebriefContent(
        "Error generating your debrief. Please check your API key and try again."
      );
    } finally {
      setIsGenerating(false);
    }
  }, [context, chatMessages, isGenerating, hasGenerated, onSave]);

  useEffect(() => {
    generateDebrief();
  }, [generateDebrief]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(debriefContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-3xl mx-auto px-4 pt-6 pb-6 sm:pt-8 sm:pb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 animate-fade-up">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl accent-amber flex items-center justify-center">
            <DocumentIcon className="w-5 h-5 text-white relative z-10" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-text-primary">
              Your Conversation Prep Sheet
            </h2>
            <p className="text-xs text-text-tertiary">
              {context.template?.title} — {context.attendees || "Your meeting"}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        {hasGenerated && (
          <div className="flex items-center gap-2 animate-fade-in">
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
        )}
      </div>

      {/* Content card */}
      <div
        className="debrief-artifact rounded-xl border border-border bg-surface p-6 sm:p-8 animate-fade-up print:shadow-none print:border-none"
        style={{ animationDelay: "0.1s" }}
      >
        {isGenerating && !debriefContent && (
          <div className="flex items-center gap-3 text-text-tertiary">
            <div className="thinking-dots flex items-center gap-0.5">
              <span />
              <span />
              <span />
            </div>
            <span className="text-sm">Generating your prep sheet...</span>
          </div>
        )}

        {debriefContent && (
          <div
            className="prose debrief-prose"
            dangerouslySetInnerHTML={{
              __html: renderDebriefMarkdown(debriefContent),
            }}
          />
        )}
      </div>

      {hasGenerated && (
        <div
          className="text-center mt-6 animate-fade-in"
          style={{ animationDelay: "0.3s" }}
        >
          <div className="flex flex-col items-center gap-2 mb-3">
            {saveStatus === "saving" && (
              <span className="text-xs text-text-tertiary">Saving...</span>
            )}
            {saveStatus === "saved" && (
              <span className="text-xs text-green-600 flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
                Saved to your dashboard
              </span>
            )}
            {saveStatus === "error" && (
              <span className="text-xs text-red-500">Could not save session</span>
            )}
            {saveStatus === "guest" && (
              <button
                onClick={() => signIn("google", { callbackUrl: "/coach" })}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-surface text-sm font-medium text-text-primary hover:bg-brand-50 transition-all duration-200"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Sign in with Google to save this session
              </button>
            )}
          </div>
          <p className="text-xs text-text-tertiary mb-5">
            Good luck with your conversation! You&apos;ve got this.
          </p>
          <div className="flex items-center justify-center">
            <Link
              href="/coach"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg gradient-brand text-white text-sm font-semibold hover:opacity-90 transition-all duration-200"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              New Session
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
