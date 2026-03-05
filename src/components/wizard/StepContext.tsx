"use client";

import type { WizardContext } from "@/lib/types";
import { getIcon } from "../Icons";

export default function StepContext({
  context,
  onChange,
}: {
  context: WizardContext;
  onChange: (updates: Partial<WizardContext>) => void;
}) {
  const template = context.template;
  const IconComponent = template ? getIcon(template.icon) : null;

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
        {/* Template badge — shows what type of conversation was selected */}
        {template && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-brand-50 border border-brand-100">
            {IconComponent && (
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-brand-100 flex items-center justify-center">
                <IconComponent className="w-4 h-4 text-brand-600" />
              </div>
            )}
            <div className="min-w-0">
              <p className="text-sm font-semibold text-brand-700 truncate">
                {template.title}
              </p>
              <p className="text-xs text-brand-500 truncate">
                {template.description}
              </p>
            </div>
          </div>
        )}

        {/* Two-column row: Attendees + Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Attendees */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-text-tertiary mb-1.5">
              Who is this conversation with?
            </label>
            <input
              type="text"
              value={context.attendees}
              onChange={(e) => onChange({ attendees: e.target.value })}
              placeholder="e.g., Sarah Chen — Senior Engineer"
              className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-brand-300 focus:ring-2 focus:ring-brand-100 transition-all"
            />
          </div>

          {/* Date picker */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-text-tertiary mb-1.5">
              When is this happening?
            </label>
            <input
              type="date"
              value={context.dateTime}
              onChange={(e) => onChange({ dateTime: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-sm text-text-primary focus:outline-none focus:border-brand-300 focus:ring-2 focus:ring-brand-100 transition-all"
            />
          </div>
        </div>

        {/* Desired outcome — optional */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-text-tertiary mb-1.5">
            Desired outcome{" "}
            <span className="text-text-tertiary/70 normal-case tracking-normal">(optional)</span>
          </label>
          <input
            type="text"
            value={context.desiredOutcome}
            onChange={(e) => onChange({ desiredOutcome: e.target.value })}
            placeholder="e.g., Agree on a clear improvement plan, Align on next steps..."
            className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-brand-300 focus:ring-2 focus:ring-brand-100 transition-all"
          />
        </div>

        {/* Additional context — tall textarea */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-text-tertiary mb-1.5">
            Additional context{" "}
            <span className="text-text-tertiary/70 normal-case tracking-normal">(optional)</span>
          </label>
          <textarea
            value={context.additionalContext}
            onChange={(e) => onChange({ additionalContext: e.target.value })}
            placeholder="e.g., This person has been defensive in past feedback conversations. They recently shipped a major feature but have been missing smaller deadlines..."
            rows={6}
            className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-brand-300 focus:ring-2 focus:ring-brand-100 transition-all resize-none"
          />
        </div>
      </div>
    </div>
  );
}
