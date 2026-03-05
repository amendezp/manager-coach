"use client";

import Link from "next/link";
import { SparklesIcon, ArrowRightIcon } from "@/components/Icons";

const STEPS = [
  {
    num: "1",
    label: "Prepare",
    description: "Choose a conversation type and provide your context",
    color: "bg-brand-500",
  },
  {
    num: "2",
    label: "Rehearse",
    description: "Practice with an AI coach that plays the other side",
    color: "bg-amber-500",
  },
  {
    num: "3",
    label: "Debrief",
    description: "Get a personalized prep sheet you can bring to the meeting",
    color: "bg-violet-500",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-dvh bg-surface-secondary">
      {/* Header */}
      <header className="border-b border-border/60 bg-surface/70 backdrop-blur-xl px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
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
          </div>

          {/* Sign in button (placeholder — will be wired to NextAuth) */}
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-surface text-sm font-medium text-text-primary hover:bg-surface-tertiary hover:border-border transition-all duration-200"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Sign in with Google
          </button>
        </div>
      </header>

      {/* Hero */}
      <div className="max-w-4xl mx-auto px-4 pt-10 sm:pt-16 pb-6">
        <div className="text-center mb-10 animate-fade-up">
          <div className="relative inline-flex items-center justify-center mb-6">
            <div className="absolute inset-0 w-20 h-20 rounded-3xl bg-brand-200/40 blur-2xl" />
            <div className="relative w-16 h-16 rounded-2xl gradient-brand flex items-center justify-center shadow-xl shadow-brand-500/20">
              <SparklesIcon className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-text-primary mb-4">
            Your AI Leadership Coach
          </h2>
          <p className="text-text-secondary text-base sm:text-lg leading-relaxed max-w-2xl mx-auto mb-8">
            Prepare for crucial conversations with structured coaching.
            Rehearse the hard parts, get real-time feedback, and walk in
            with a personalized prep sheet.
          </p>

          {/* Primary CTA */}
          <Link
            href="/coach"
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl gradient-brand text-white font-semibold text-base shadow-lg shadow-brand-300/30 hover:shadow-xl hover:shadow-brand-300/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
          >
            <span>Start Coaching Session</span>
            <ArrowRightIcon className="w-5 h-5" />
          </Link>
        </div>

        {/* How it works — 3 steps */}
        <div
          className="max-w-2xl mx-auto mb-12 animate-fade-up"
          style={{ animationDelay: "0.15s" }}
        >
          <div className="flex items-center gap-2.5 mb-5 px-1">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-brand-500" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-text-tertiary">
                How it works
              </h3>
            </div>
            <div className="flex-1 h-px bg-border" />
          </div>

          <div className="space-y-3">
            {STEPS.map((step, i) => (
              <div
                key={step.num}
                className={`flex items-center gap-4 p-4 rounded-xl border border-border/80 bg-surface animate-fade-up-sm stagger-${i + 1}`}
              >
                <div
                  className={`flex-shrink-0 w-10 h-10 rounded-lg ${step.color} flex items-center justify-center`}
                >
                  <span className="text-sm font-bold text-white">
                    {step.num}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary">
                    {step.label}
                  </p>
                  <p className="text-xs text-text-tertiary mt-0.5">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div
          className="text-center pb-8 animate-fade-in"
          style={{ animationDelay: "0.3s" }}
        >
          <p className="text-xs text-text-tertiary">
            All conversations are private and confidential.
          </p>
        </div>
      </div>
    </div>
  );
}
