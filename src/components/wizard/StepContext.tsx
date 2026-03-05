"use client";

import type { WizardContext, CalendarEvent } from "@/lib/types";

export default function StepContext({
  context,
  onChange,
}: {
  context: WizardContext;
  calendarEvent?: CalendarEvent | null;
  onChange: (updates: Partial<WizardContext>) => void;
}) {
  return (
    <div className="max-w-2xl mx-auto px-4 pt-8 pb-6 sm:pt-10 sm:pb-8">
      <div className="text-center mb-8 animate-fade-up">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-text-primary mb-2">
          Tell us about this conversation
        </h2>
        <p className="text-text-secondary text-sm leading-relaxed max-w-lg mx-auto">
          The more context you provide, the more tailored your rehearsal and
          preparation will be.
        </p>
      </div>

      <div className="space-y-5 animate-fade-up" style={{ animationDelay: "0.1s" }}>
        {/* Nature of interaction */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-text-tertiary mb-1.5">
            Nature of the interaction
          </label>
          <input
            type="text"
            value={context.interactionNature}
            onChange={(e) => onChange({ interactionNature: e.target.value })}
            placeholder="e.g., Scheduled 1:1, Ad-hoc meeting, Performance review cycle..."
            className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-brand-300 focus:ring-2 focus:ring-brand-100 transition-all"
          />
        </div>

        {/* Attendees */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-text-tertiary mb-1.5">
            Who is this conversation with?
          </label>
          <input
            type="text"
            value={context.attendees}
            onChange={(e) => onChange({ attendees: e.target.value })}
            placeholder="e.g., Sarah Chen — Senior Engineer, 2 years on team"
            className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-brand-300 focus:ring-2 focus:ring-brand-100 transition-all"
          />
        </div>

        {/* Goal */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-text-tertiary mb-1.5">
            What&apos;s your desired outcome?
          </label>
          <input
            type="text"
            value={context.desiredOutcome}
            onChange={(e) => onChange({ desiredOutcome: e.target.value })}
            placeholder="e.g., Agree on a clear improvement plan, Align on next steps..."
            className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-brand-300 focus:ring-2 focus:ring-brand-100 transition-all"
          />
        </div>

        {/* Date/time */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-text-tertiary mb-1.5">
            When is this happening?
          </label>
          <input
            type="text"
            value={context.dateTime}
            onChange={(e) => onChange({ dateTime: e.target.value })}
            placeholder="e.g., Tomorrow at 2pm, Friday morning..."
            className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-brand-300 focus:ring-2 focus:ring-brand-100 transition-all"
          />
        </div>

        {/* Additional context */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-text-tertiary mb-1.5">
            Additional context{" "}
            <span className="text-text-tertiary/70 normal-case tracking-normal">(optional)</span>
          </label>
          <textarea
            value={context.additionalContext}
            onChange={(e) => onChange({ additionalContext: e.target.value })}
            placeholder="e.g., This person has been defensive in past feedback conversations. They recently shipped a major feature but have been missing smaller deadlines..."
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-brand-300 focus:ring-2 focus:ring-brand-100 transition-all resize-none"
          />
        </div>
      </div>
    </div>
  );
}
