"use client";

import { SparklesIcon } from "./Icons";
import type { Message } from "@/lib/types";

function renderMarkdown(text: string): string {
  let html = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Coach feedback blocks
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

function ThinkingIndicator() {
  return (
    <div className="thinking-dots flex items-center gap-0.5 py-1 px-0.5">
      <span />
      <span />
      <span />
    </div>
  );
}

export default function MessageBubble({
  message,
  isStreaming,
}: {
  message: Message;
  isStreaming?: boolean;
}) {
  const isUser = message.role === "user";
  const isEmpty = !message.content;

  return (
    <div
      className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""} ${
        isUser ? "animate-slide-in-right" : "animate-slide-in-left"
      }`}
    >
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full gradient-brand flex items-center justify-center mt-0.5 shadow-sm shadow-brand-200/50">
          <SparklesIcon className="w-4 h-4 text-white" />
        </div>
      )}
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-surface-tertiary border border-border flex items-center justify-center mt-0.5">
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
          max-w-[85%] sm:max-w-[75%] rounded-2xl text-sm leading-relaxed
          ${
            isUser
              ? "gradient-brand text-white rounded-tr-md px-4 py-3 shadow-sm shadow-brand-200/30"
              : "bg-surface border border-border/80 rounded-tl-md px-4 py-3 shadow-sm"
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
