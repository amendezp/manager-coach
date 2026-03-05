"use client";

import Link from "next/link";
import { SparklesIcon, ArrowRightIcon } from "@/components/Icons";

const STEPS = [
  { num: "1", label: "Choose a coachable moment", color: "bg-brand-500" },
  { num: "2", label: "Provide context", color: "bg-brand-400" },
  { num: "3", label: "Learn key frameworks", color: "bg-emerald-500" },
  { num: "4", label: "Rehearse with AI", color: "bg-amber-500" },
  { num: "5", label: "Get your prep sheet", color: "bg-violet-500" },
];

export default function LandingPage() {
  return (
    <div className="min-h-dvh bg-surface-secondary">
      {/* Header */}
      <header className="border-b border-border/60 bg-surface/70 backdrop-blur-xl px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
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

        {/* How it works */}
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
                  className={`flex-shrink-0 w-8 h-8 rounded-lg ${step.color} flex items-center justify-center`}
                >
                  <span className="text-xs font-bold text-white">
                    {step.num}
                  </span>
                </div>
                <p className="text-sm font-medium text-text-primary">
                  {step.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Value props */}
        <div
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12 animate-fade-up"
          style={{ animationDelay: "0.3s" }}
        >
          <div className="p-5 rounded-xl border border-border/80 bg-surface text-center">
            <p className="text-2xl font-bold text-brand-600 mb-1">85%</p>
            <p className="text-xs text-text-tertiary">
              of new managers get zero formal training
            </p>
          </div>
          <div className="p-5 rounded-xl border border-border/80 bg-surface text-center">
            <p className="text-2xl font-bold text-brand-600 mb-1">2-3 hrs</p>
            <p className="text-xs text-text-tertiary">
              saved per week on meeting prep & feedback
            </p>
          </div>
          <div className="p-5 rounded-xl border border-border/80 bg-surface text-center">
            <p className="text-2xl font-bold text-brand-600 mb-1">10×</p>
            <p className="text-xs text-text-tertiary">
              cheaper than traditional executive coaching
            </p>
          </div>
        </div>

        {/* Footer */}
        <div
          className="text-center pb-8 animate-fade-in"
          style={{ animationDelay: "0.4s" }}
        >
          <p className="text-xs text-text-tertiary">
            All conversations are private, confidential, and stateless &mdash;
            no data is stored or retained.
          </p>
        </div>
      </div>
    </div>
  );
}
