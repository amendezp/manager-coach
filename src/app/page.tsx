"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import { SparklesIcon, ArrowRightIcon, CalendarIcon } from "@/components/Icons";
import { getRelativeTime } from "@/lib/utils";
import UserMenu from "@/components/UserMenu";

interface CalendarApiEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  attendees: string[];
}

interface SessionSummary {
  id: string;
  templateTitle: string | null;
  createdAt: string;
}

function formatEventTime(isoString: string) {
  const date = new Date(isoString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const timeStr = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  if (date.toDateString() === today.toDateString()) return `Today at ${timeStr}`;
  if (date.toDateString() === tomorrow.toDateString())
    return `Tomorrow at ${timeStr}`;

  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatDateISO(isoString: string) {
  return new Date(isoString).toISOString().split("T")[0];
}

function formatTime(isoString: string) {
  return new Date(isoString).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

const STEPS = [
  {
    num: "01",
    label: "Prepare",
    description: "Choose a conversation type and provide your context",
    accentClass: "accent-green",
  },
  {
    num: "02",
    label: "Rehearse",
    description: "Practice with an AI coach that plays the other side",
    accentClass: "accent-blue",
  },
  {
    num: "03",
    label: "Prep Sheet",
    description: "Get a personalized prep sheet you can bring to the meeting",
    accentClass: "accent-amber",
  },
];

export default function LandingPage() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const router = useRouter();

  const [events, setEvents] = useState<CalendarApiEvent[]>([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [recentSessions, setRecentSessions] = useState<SessionSummary[]>([]);

  useEffect(() => {
    if (!isAuthenticated) return;
    setEventsLoading(true);
    fetch("/api/calendar")
      .then((res) => (res.ok ? res.json() : { events: [] }))
      .then((data) => setEvents(data.events || []))
      .catch(() => setEvents([]))
      .finally(() => setEventsLoading(false));

    // Fetch recent sessions for returning users
    fetch("/api/sessions")
      .then((res) => (res.ok ? res.json() : []))
      .then((data: SessionSummary[]) => setRecentSessions(data.slice(0, 3)))
      .catch(() => setRecentSessions([]));
  }, [isAuthenticated]);

  const handleSelectEvent = (event: CalendarApiEvent) => {
    sessionStorage.setItem(
      "selectedCalendarEvent",
      JSON.stringify({
        id: event.id,
        title: event.title,
        date: formatDateISO(event.start),
        time: formatTime(event.start),
        attendees: event.attendees,
      })
    );
    router.push("/coach");
  };

  return (
    <div className="min-h-dvh bg-surface-secondary">
      {/* Header */}
      <header className="border-b border-border bg-surface/80 backdrop-blur-xl px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
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
          </div>

          {isAuthenticated && session?.user ? (
            <UserMenu user={session.user} />
          ) : (
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
              Sign in with Google
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 pt-10 sm:pt-16 pb-6">
        {isAuthenticated ? (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Left column: Hero */}
            <div className="lg:col-span-3">
              <div className="mb-10 animate-fade-up">
                <div className="text-sm-caps text-text-tertiary mb-4">
                  Coaching Copilot
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4" style={{ letterSpacing: "-0.03em", lineHeight: 1.1 }}>
                  Prepare for the
                  <br />
                  conversations
                  <br />
                  that matter.
                </h2>
                <p className="text-text-secondary text-base leading-relaxed max-w-md mb-8">
                  Rehearse crucial conversations with an AI coach,
                  get real-time feedback, and walk in with a personalized prep sheet.
                </p>

                <Link
                  href="/coach"
                  className="inline-flex items-center gap-2.5 px-6 py-3 rounded-lg gradient-brand text-white font-semibold text-sm hover:opacity-90 active:scale-[0.98] transition-all duration-200"
                >
                  <span>Start Coaching Session</span>
                  <ArrowRightIcon className="w-4 h-4" />
                </Link>
              </div>

              {/* How it works */}
              <div className="animate-fade-up" style={{ animationDelay: "0.15s" }}>
                <div className="text-sm-caps text-text-tertiary mb-4">How it works</div>
                <div className="space-y-2">
                  {STEPS.map((step, i) => (
                    <div
                      key={step.num}
                      className={`flex items-center gap-4 p-4 rounded-lg border border-border bg-surface animate-fade-up-sm stagger-${i + 1}`}
                    >
                      <div className={`flex-shrink-0 w-10 h-10 rounded-xl ${step.accentClass} flex items-center justify-center`}>
                        <span className="text-xs font-bold text-white relative z-10">{step.num}</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-text-primary">{step.label}</p>
                        <p className="text-xs text-text-tertiary mt-0.5">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent sessions */}
              {recentSessions.length > 0 && (
                <div className="mt-8 animate-fade-up" style={{ animationDelay: "0.25s" }}>
                  <div className="text-sm-caps text-text-tertiary mb-3">Recent sessions</div>
                  <div className="space-y-1.5">
                    {recentSessions.map((s) => (
                      <Link
                        key={s.id}
                        href={`/dashboard/${s.id}`}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg border border-border bg-surface hover:bg-brand-50 hover:border-brand-300 transition-all duration-200"
                      >
                        <div className="w-2 h-2 rounded-full bg-brand-400 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-text-primary truncate">
                            {s.templateTitle || "Coaching Session"}
                          </p>
                        </div>
                        <span className="text-[11px] text-text-tertiary flex-shrink-0">
                          {getRelativeTime(s.createdAt)}
                        </span>
                        <svg className="w-4 h-4 text-text-tertiary flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                        </svg>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right column: Calendar events */}
            <div className="lg:col-span-2">
              <div className="rounded-xl border border-border bg-surface p-5 animate-fade-up sticky top-8" style={{ animationDelay: "0.1s" }}>
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-8 h-8 rounded-lg accent-green flex items-center justify-center">
                    <CalendarIcon className="w-4 h-4 text-white relative z-10" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-text-primary">Prep for a Meeting</h3>
                    <p className="text-[11px] text-text-tertiary">Select a meeting to start preparing</p>
                  </div>
                </div>

                <div className="space-y-1.5 max-h-[420px] overflow-y-auto pr-1">
                  {eventsLoading && (
                    <div className="flex items-center justify-center py-8">
                      <div className="thinking-dots flex items-center gap-0.5"><span /><span /><span /></div>
                    </div>
                  )}

                  {!eventsLoading && events.length === 0 && (
                    <div className="text-center py-6">
                      <CalendarIcon className="w-6 h-6 text-text-tertiary mx-auto mb-2 opacity-50" />
                      <p className="text-xs text-text-tertiary">No upcoming meetings found.</p>
                    </div>
                  )}

                  {!eventsLoading && events.map((event, i) => (
                    <button
                      key={event.id}
                      onClick={() => handleSelectEvent(event)}
                      className={`w-full flex items-start gap-3 p-3 rounded-lg border border-border/70 bg-surface hover:bg-brand-50 hover:border-brand-300 text-left transition-all duration-200 animate-fade-up-sm stagger-${Math.min(i + 1, 6)}`}
                    >
                      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-brand-50 border border-brand-200 flex items-center justify-center mt-0.5">
                        <CalendarIcon className="w-4 h-4 text-brand-500" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-text-primary truncate">{event.title}</p>
                        <p className="text-[11px] text-text-tertiary mt-0.5">{formatEventTime(event.start)}</p>
                        {event.attendees.length > 0 && (
                          <p className="text-[11px] text-text-tertiary mt-0.5 truncate">
                            with {event.attendees.slice(0, 2).join(", ")}
                            {event.attendees.length > 2 && ` +${event.attendees.length - 2}`}
                          </p>
                        )}
                      </div>
                      <svg className="w-4 h-4 text-text-tertiary mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                      </svg>
                    </button>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-border space-y-2">
                  <Link
                    href="/coach"
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold text-text-secondary hover:text-text-primary bg-brand-50 hover:bg-brand-100 border border-brand-200 transition-all duration-200"
                  >
                    Or start a fresh session
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                    </svg>
                  </Link>
                  <Link
                    href="/team"
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold text-text-secondary hover:text-text-primary hover:bg-brand-50/50 border border-transparent hover:border-brand-200 transition-all duration-200"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                    </svg>
                    My Team
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="text-center mb-12 animate-fade-up">
              <div className="text-sm-caps text-text-tertiary mb-6">Coaching Copilot</div>
              <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4" style={{ letterSpacing: "-0.03em", lineHeight: 1.1 }}>
                Prepare for the
                <br />
                conversations that matter.
              </h2>
              <p className="text-text-secondary text-base sm:text-lg leading-relaxed max-w-lg mx-auto mb-8">
                Rehearse crucial conversations with an AI coach,
                get real-time feedback, and walk in with a personalized prep sheet.
              </p>
              <button
                onClick={() => signIn("google", { callbackUrl: "/coach" })}
                className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-lg gradient-brand text-white font-semibold text-base hover:opacity-90 active:scale-[0.98] transition-all duration-200"
              >
                <span>Get Started</span>
                <ArrowRightIcon className="w-5 h-5" />
              </button>
              <div className="mt-3">
                <Link
                  href="/coach"
                  className="text-sm text-text-secondary hover:text-brand-600 transition-colors duration-200"
                >
                  Try without signing in &rarr;
                </Link>
              </div>
            </div>

            <div className="max-w-2xl mx-auto mb-12 animate-fade-up" style={{ animationDelay: "0.15s" }}>
              <div className="text-sm-caps text-text-tertiary mb-4">How it works</div>
              <div className="space-y-2">
                {STEPS.map((step, i) => (
                  <div
                    key={step.num}
                    className={`flex items-center gap-4 p-4 rounded-lg border border-border bg-surface animate-fade-up-sm stagger-${i + 1}`}
                  >
                    <div className={`flex-shrink-0 w-10 h-10 rounded-xl ${step.accentClass} flex items-center justify-center`}>
                      <span className="text-xs font-bold text-white relative z-10">{step.num}</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-text-primary">{step.label}</p>
                      <p className="text-xs text-text-tertiary mt-0.5">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        <div className="text-center pb-8 mt-8 animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <p className="text-xs text-text-tertiary">All conversations are private and confidential.</p>
        </div>
      </div>
    </div>
  );
}
