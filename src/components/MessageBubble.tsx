"use client";

import { SparklesIcon } from "./Icons";
import type { Message } from "@/lib/types";

// --- Markdown rendering ---

function renderMarkdown(text: string): string {
  let html = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  html = html.replace(
    /\[Coach [Ff]eedback\]:?\s*([\s\S]*?)(?=\n\n|\n\[|$)/g,
    '<div class="coach-feedback">$1</div>'
  );

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

  html = html.replace(
    /<br\/>(<\/?(ul|ol|li|h[1-4]|blockquote|div|hr))/g,
    "$1"
  );
  html = html.replace(
    /(<\/(ul|ol|li|h[1-4]|blockquote|div|hr)>)<br\/>/g,
    "$1"
  );

  return `<p>${html}</p>`;
}

function renderMarkdownSimple(text: string): string {
  let html = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  html = html
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, "<em>$1</em>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
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

  html = html.replace(/<br\/>(<\/?(ul|ol|li|blockquote|div))/g, "$1");
  html = html.replace(/(<\/(ul|ol|li|blockquote|div)>)<br\/>/g, "$1");

  return html;
}

// --- Feedback detection & parsing ---

function isFeedbackMessage(content: string): boolean {
  return /##\s*Rehearsal Feedback/i.test(content);
}

function parseFeedbackSections(content: string) {
  const sections = { strengths: "", improvements: "", takeaway: "" };

  const wellMatch = content.match(
    /###?\s*What You Did Well\s*\n([\s\S]*?)(?=\n###?\s|$)/
  );
  if (wellMatch) sections.strengths = wellMatch[1].trim();

  const improveMatch = content.match(
    /###?\s*What Could Improve\s*\n([\s\S]*?)(?=\n###?\s|$)/
  );
  if (improveMatch) sections.improvements = improveMatch[1].trim();

  const takeawayMatch = content.match(
    /###?\s*Key Takeaway\s*\n([\s\S]*?)$/
  );
  if (takeawayMatch) sections.takeaway = takeawayMatch[1].trim();

  return sections;
}

// --- Sub-components ---

function ThinkingIndicator() {
  return (
    <div className="thinking-dots flex items-center gap-0.5 py-1 px-0.5">
      <span />
      <span />
      <span />
    </div>
  );
}

function FeedbackCard({ content }: { content: string }) {
  const { strengths, improvements, takeaway } = parseFeedbackSections(content);

  return (
    <div className="w-full animate-slide-in-left">
      {/* Title */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center">
          <SparklesIcon className="w-4 h-4 text-white" />
        </div>
        <h3 className="text-base font-bold text-text-primary">
          Rehearsal Feedback
        </h3>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        {/* Strengths */}
        <div className="rounded-lg border border-emerald-200 bg-emerald-50/60 p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
              <svg
                className="w-3.5 h-3.5 text-emerald-600"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m4.5 12.75 6 6 9-13.5"
                />
              </svg>
            </div>
            <h4 className="text-sm font-semibold text-emerald-700">
              What You Did Well
            </h4>
          </div>
          {strengths ? (
            <div
              className="prose text-sm text-emerald-900/80 [&_strong]:text-emerald-800 [&_li::marker]:text-emerald-400"
              dangerouslySetInnerHTML={{
                __html: renderMarkdownSimple(strengths),
              }}
            />
          ) : (
            <div className="thinking-dots flex items-center gap-0.5 py-2">
              <span />
              <span />
              <span />
            </div>
          )}
        </div>

        {/* Improvements */}
        <div className="rounded-lg border border-amber-200 bg-amber-50/60 p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center">
              <svg
                className="w-3.5 h-3.5 text-amber-600"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                />
              </svg>
            </div>
            <h4 className="text-sm font-semibold text-amber-700">
              What Could Improve
            </h4>
          </div>
          {improvements ? (
            <div
              className="prose text-sm text-amber-900/80 [&_strong]:text-amber-800 [&_li::marker]:text-amber-400"
              dangerouslySetInnerHTML={{
                __html: renderMarkdownSimple(improvements),
              }}
            />
          ) : (
            <div className="thinking-dots flex items-center gap-0.5 py-2">
              <span />
              <span />
              <span />
            </div>
          )}
        </div>
      </div>

      {/* Key Takeaway */}
      {takeaway && (
        <div className="rounded-lg border border-brand-200 bg-brand-50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-brand-100 flex items-center justify-center">
              <svg
                className="w-3.5 h-3.5 text-brand-600"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
                />
              </svg>
            </div>
            <h4 className="text-sm font-semibold text-brand-700">
              Key Takeaway
            </h4>
          </div>
          <p className="text-sm text-brand-800/80 leading-relaxed pl-8">
            {takeaway}
          </p>
        </div>
      )}
    </div>
  );
}

// --- Main Component ---

export default function MessageBubble({
  message,
  isStreaming,
}: {
  message: Message;
  isStreaming?: boolean;
}) {
  const isUser = message.role === "user";
  const isEmpty = !message.content;
  const isFeedback = !isUser && isFeedbackMessage(message.content);

  // Special full-width rendering for feedback messages
  if (isFeedback) {
    return <FeedbackCard content={message.content} />;
  }

  return (
    <div
      className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""} ${
        isUser ? "animate-slide-in-right" : "animate-slide-in-left"
      }`}
    >
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-lg gradient-brand flex items-center justify-center mt-0.5">
          <SparklesIcon className="w-4 h-4 text-white" />
        </div>
      )}
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-brand-50 border border-brand-200 flex items-center justify-center mt-0.5">
          <svg
            className="w-4 h-4 text-text-tertiary"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
            />
          </svg>
        </div>
      )}

      <div
        className={`
          max-w-[85%] sm:max-w-[75%] rounded-lg text-sm leading-relaxed
          ${
            isUser
              ? "gradient-user text-white rounded-tr-sm px-4 py-3"
              : "bg-surface border border-border rounded-tl-sm px-4 py-3"
          }
        `}
      >
        {isEmpty && isStreaming ? (
          <ThinkingIndicator />
        ) : isUser ? (
          <p className="whitespace-pre-wrap">{message.content}</p>
        ) : (
          <div
            className="prose"
            dangerouslySetInnerHTML={{
              __html: renderMarkdown(message.content),
            }}
          />
        )}
      </div>
    </div>
  );
}
