"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { SparklesIcon, ArrowRightIcon, getIcon } from "@/components/Icons";
import UserMenu from "@/components/UserMenu";

interface SessionSummary {
  id: string;
  templateId: string | null;
  templateTitle: string | null;
  context: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function getRelativeTime(dateStr: string) {
  const now = Date.now();
  const date = new Date(dateStr).getTime();
  const diff = now - date;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return formatDate(dateStr);
}

// Get accent color from template data (or fallback for legacy sessions)
function getAccentClass(templateData: Record<string, unknown> | null): string {
  const color = templateData?.color as string;
  if (color) return color;
  const iconName = (templateData?.icon as string) || "";
  const map: Record<string, string> = {
    clipboard: "accent-green",
    users: "accent-blue",
    alert: "accent-red",
    dollar: "accent-teal",
    book: "accent-teal",
    ear: "accent-red",
    lightbulb: "accent-amber",
    shield: "accent-amber",
    academic: "accent-violet",
    chat: "accent-blue",
    pencil: "accent-violet",
  };
  return map[iconName] || "accent-green";
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [sessions, setSessions] = useState<SessionSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSessions() {
      try {
        const res = await fetch("/api/sessions");
        if (res.ok) {
          const data = await res.json();
          setSessions(data);
        }
      } catch (err) {
        console.error("Failed to fetch sessions:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchSessions();
  }, []);

  return (
    <div className="min-h-dvh bg-surface-secondary">
      {/* Header */}
      <header className="border-b border-border bg-surface/80 backdrop-blur-xl px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl gradient-brand flex items-center justify-center">
              <SparklesIcon className="w-[18px] h-[18px] text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-text-primary tracking-tight">
                AI Coach
              </h1>
              <p className="text-[11px] text-text-tertiary leading-tight">
                Leadership coaching for managers
              </p>
            </div>
          </Link>

          {session?.user && <UserMenu user={session.user} />}
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 pt-8 pb-12">
        {/* Page title + CTA */}
        <div className="flex items-center justify-between mb-8 animate-fade-up">
          <div>
            <div className="text-sm-caps text-text-tertiary mb-1">Dashboard</div>
            <h2 className="text-2xl font-bold text-text-primary" style={{ letterSpacing: "-0.02em" }}>
              Your Sessions
            </h2>
          </div>
          <Link
            href="/coach"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg gradient-brand text-white font-semibold text-sm hover:opacity-90 active:scale-[0.98] transition-all duration-200"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            New Session
          </Link>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="thinking-dots flex items-center gap-0.5">
              <span />
              <span />
              <span />
            </div>
          </div>
        )}

        {/* Empty state */}
        {!loading && sessions.length === 0 && (
          <div className="text-center py-20 animate-fade-up">
            <div className="w-14 h-14 rounded-xl bg-brand-50 border border-brand-200 flex items-center justify-center mx-auto mb-4">
              <SparklesIcon className="w-7 h-7 text-brand-400" />
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              No sessions yet
            </h3>
            <p className="text-sm text-text-secondary mb-6 max-w-md mx-auto">
              Start your first coaching session to prepare for a crucial
              conversation. Your prep sheets will appear here.
            </p>
            <Link
              href="/coach"
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-lg gradient-brand text-white font-semibold text-sm hover:opacity-90 active:scale-[0.98] transition-all duration-200"
            >
              <span>Start Your First Session</span>
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* Sessions list */}
        {!loading && sessions.length > 0 && (
          <div className="border border-border rounded-xl bg-surface overflow-hidden animate-fade-up" style={{ animationDelay: "0.1s" }}>
            {sessions.map((s, i) => {
              const ctx = s.context as Record<string, unknown> | null;
              const attendees = (ctx?.attendees as string) || "";
              const dateTime = (ctx?.dateTime as string) || "";
              const templateData = ctx?.template as Record<string, unknown> | null;
              const iconName = (templateData?.icon as string) || "";
              const IconComponent = iconName ? getIcon(iconName) : SparklesIcon;
              const accentClass = getAccentClass(templateData);

              return (
                <Link
                  key={s.id}
                  href={`/dashboard/${s.id}`}
                  className={`group flex items-center gap-4 p-5 border-b border-border last:border-b-0 hover:bg-brand-50/50 transition-colors duration-200 animate-fade-up-sm stagger-${Math.min(i + 1, 6)}`}
                >
                  <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${accentClass} flex items-center justify-center`}>
                    <IconComponent className="w-5 h-5 text-white relative z-10" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-text-primary group-hover:text-text-primary transition-colors truncate">
                      {s.templateTitle || "Coaching Session"}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5 text-xs text-text-tertiary">
                      {attendees && (
                        <>
                          <span className="truncate max-w-[200px]">
                            with {attendees}
                          </span>
                          <span>·</span>
                        </>
                      )}
                      <span>{dateTime || formatDate(s.createdAt)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-text-tertiary hidden sm:inline">
                      {getRelativeTime(s.createdAt)}
                    </span>
                    <svg
                      className="w-4 h-4 text-text-tertiary group-hover:text-text-primary transition-colors"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                    </svg>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
