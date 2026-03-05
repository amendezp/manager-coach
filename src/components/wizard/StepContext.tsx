"use client";

import type { WizardContext } from "@/lib/types";
import { getIcon } from "../Icons";
import MicButton from "../MicButton";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useCallback } from "react";

export default function StepContext({
  context,
  onChange,
}: {
  context: WizardContext;
  onChange: (updates: Partial<WizardContext>) => void;
}) {
  const template = context.template;
  const IconComponent = template ? getIcon(template.icon) : null;

  // Speech recognition for the "Additional context" textarea
  const handleTranscript = useCallback(
    (text: string) => {
      const prev = context.additionalContext.trim();
      const separator = prev ? " " : "";
      onChange({ additionalContext: prev + separator + text });
    },
    [context.additionalContext, onChange]
  );

  const {
    isSupported,
    isListening,
    interimTranscript,
    toggleListening,
  } = useSpeechRecognition({
    onTranscript: handleTranscript,
  });

  // Display value: existing text + interim preview
  const displayValue = isListening && interimTranscript
    ? context.additionalContext + (context.additionalContext.trim() ? " " : "") + interimTranscript
    : context.additionalContext;

  return (
    <div className="max-w-2xl mx-auto px-4 pt-8 pb-6 sm:pt-10 sm:pb-8">
      <div className="text-center mb-8 animate-fade-up">
        <h2 className="text-xl sm:text-2xl font-bold text-text-primary mb-2" style={{ letterSpacing: "-0.02em" }}>
          Tell us about this conversation
        </h2>
        <p className="text-text-secondary text-sm leading-relaxed max-w-lg mx-auto">
          The more context you provide, the more tailored your rehearsal and
          preparation will be.
        </p>
      </div>

      <div className="space-y-5 animate-fade-up" style={{ animationDelay: "0.1s" }}>
        {/* Template badge */}
        {template && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-brand-50 border border-brand-200">
            {IconComponent && (
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-brand-100 border border-brand-200 flex items-center justify-center">
                <IconComponent className="w-4 h-4 text-brand-600" />
              </div>
            )}
            <div className="min-w-0">
              <p className="text-sm font-semibold text-text-primary truncate">
                {template.title}
              </p>
              <p className="text-xs text-text-tertiary truncate">
                {template.description}
              </p>
            </div>
          </div>
        )}

        {/* Two-column row: Attendees + Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Attendees */}
          <div>
            <label className="block text-sm-caps text-text-tertiary mb-1.5">
              Who is this conversation with?
            </label>
            <input
              type="text"
              value={context.attendees}
              onChange={(e) => onChange({ attendees: e.target.value })}
              placeholder="e.g., Sarah Chen — Senior Engineer"
              className="w-full px-4 py-3 rounded-lg border border-border bg-surface text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-brand-700 transition-all"
            />
          </div>

          {/* Date picker */}
          <div>
            <label className="block text-sm-caps text-text-tertiary mb-1.5">
              When is this happening?
            </label>
            <input
              type="date"
              value={context.dateTime}
              onChange={(e) => onChange({ dateTime: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-border bg-surface text-sm text-text-primary focus:outline-none focus:border-brand-700 transition-all"
            />
          </div>
        </div>

        {/* Desired outcome — optional */}
        <div>
          <label className="block text-sm-caps text-text-tertiary mb-1.5">
            Desired outcome{" "}
            <span className="text-text-tertiary/70 normal-case tracking-normal">(optional)</span>
          </label>
          <input
            type="text"
            value={context.desiredOutcome}
            onChange={(e) => onChange({ desiredOutcome: e.target.value })}
            placeholder="e.g., Agree on a clear improvement plan, Align on next steps..."
            className="w-full px-4 py-3 rounded-lg border border-border bg-surface text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-brand-700 transition-all"
          />
        </div>

        {/* Additional context — tall textarea with mic */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm-caps text-text-tertiary">
              Additional context{" "}
              <span className="text-text-tertiary/70 normal-case tracking-normal">(optional)</span>
            </label>
            {isListening && (
              <span className="flex items-center gap-1.5 text-[11px] text-red-500 font-medium">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500" />
                </span>
                Recording
              </span>
            )}
          </div>
          <div className={`relative rounded-lg border transition-all ${
            isListening ? "border-red-300" : "border-border"
          }`}>
            <textarea
              value={displayValue}
              onChange={(e) => {
                if (!isListening || !interimTranscript) {
                  onChange({ additionalContext: e.target.value });
                }
              }}
              placeholder={
                isListening
                  ? "Listening — speak naturally..."
                  : "e.g., This person has been defensive in past feedback conversations. They recently shipped a major feature but have been missing smaller deadlines..."
              }
              rows={6}
              className={`w-full px-4 py-3 rounded-lg bg-surface text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none transition-all resize-none ${
                isListening && interimTranscript ? "text-text-secondary" : ""
              }`}
            />
            {/* Mic button — positioned bottom right */}
            <div className="absolute bottom-2 right-2">
              <MicButton
                isListening={isListening}
                isSupported={isSupported}
                onClick={toggleListening}
                variant="compact"
              />
            </div>
          </div>
          {!isListening && isSupported && (
            <p className="text-xs text-text-tertiary mt-1.5 px-1">
              Type or use the microphone to dictate your context.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
