"use client";

import { CalendarIcon } from "../Icons";

export default function StepCalendar({
  onSkip,
}: {
  onSkip: () => void;
}) {
  return (
    <div className="max-w-2xl mx-auto px-4 pt-8 pb-6 sm:pt-14 sm:pb-8">
      <div className="text-center mb-10 animate-fade-up">
        <div className="relative inline-flex items-center justify-center mb-6">
          <div className="absolute inset-0 w-16 h-16 rounded-2xl bg-brand-200/40 blur-xl" />
          <div className="relative w-14 h-14 rounded-2xl gradient-brand flex items-center justify-center shadow-lg shadow-brand-500/20">
            <CalendarIcon className="w-7 h-7 text-white" />
          </div>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary mb-3">
          Connect Your Calendar
        </h2>
        <p className="text-text-secondary text-sm sm:text-base leading-relaxed max-w-lg mx-auto">
          Optionally link your Google Calendar to auto-fill your upcoming
          meeting details — or skip this step to enter them manually.
        </p>
      </div>

      <div className="max-w-md mx-auto space-y-4 animate-fade-up" style={{ animationDelay: "0.1s" }}>
        {/* Calendar connect button (stub) */}
        <button
          disabled
          className="w-full flex items-center gap-4 p-5 rounded-2xl border-2 border-dashed border-border bg-surface/50 opacity-60 cursor-not-allowed"
        >
          <div className="w-12 h-12 rounded-xl bg-surface-tertiary flex items-center justify-center">
            <svg className="w-6 h-6 text-text-tertiary" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-text-primary">
              Connect Google Calendar
            </p>
            <p className="text-xs text-text-tertiary mt-0.5">
              Coming soon — for now, skip to enter details manually
            </p>
          </div>
        </button>

        {/* Skip CTA */}
        <button
          onClick={onSkip}
          className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl border border-brand-200 bg-brand-50 hover:bg-brand-100 transition-colors duration-200 group"
        >
          <span className="text-sm font-semibold text-brand-700 group-hover:text-brand-800">
            Skip — I&apos;ll enter details manually
          </span>
          <svg
            className="w-4 h-4 text-brand-500 group-hover:translate-x-0.5 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>

      <div className="text-center mt-8 animate-fade-in" style={{ animationDelay: "0.3s" }}>
        <p className="text-xs text-text-tertiary">
          Calendar integration is optional — you can always add context in the next step
        </p>
      </div>
    </div>
  );
}
