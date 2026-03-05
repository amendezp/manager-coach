"use client";

import { useState, useCallback } from "react";
import { COACHABLE_TEMPLATES } from "@/lib/templates";
import { getIcon, PencilIcon } from "../Icons";
import MicButton from "../MicButton";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import type { CoachableTemplate, LearningConcept, WizardContext } from "@/lib/types";

/* ─── Expandable framework primer ─── */
function FrameworkPrimer({ concepts }: { concepts: LearningConcept[] }) {
  const [expanded, setExpanded] = useState(false);
  const frameworks = concepts.filter((c) => c.framework);
  if (frameworks.length === 0) return null;

  return (
    <div className="mt-3 animate-fade-up-sm">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg border border-brand-200 bg-brand-50/60 hover:bg-brand-50 transition-all text-left group"
      >
        <svg
          className="w-4 h-4 text-brand-500 flex-shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
          />
        </svg>
        <span className="text-xs font-semibold text-brand-700 flex-1">
          Framework{frameworks.length > 1 ? "s" : ""}:{" "}
          {frameworks.map((f) => f.framework).join(" · ")}
        </span>
        <svg
          className={`w-3.5 h-3.5 text-brand-400 transition-transform duration-200 ${
            expanded ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m19.5 8.25-7.5 7.5-7.5-7.5"
          />
        </svg>
      </button>

      {expanded && (
        <div className="mt-2 space-y-2 animate-fade-up-sm">
          {frameworks.map((f) => (
            <div
              key={f.framework}
              className="px-4 py-3 rounded-lg border border-brand-100 bg-white"
            >
              <p className="text-xs font-semibold text-brand-700 mb-1">
                {f.title}
              </p>
              <p className="text-xs text-text-secondary leading-relaxed">
                {f.summary}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function makeCustomTemplate(description: string): CoachableTemplate {
  return {
    id: "custom",
    title: "Custom Conversation",
    description,
    icon: "pencil",
    color: "accent-violet",
    learningConcepts: [
      {
        title: "Active Listening",
        summary:
          "Listen to understand, not to respond. Reflect back what you hear before sharing your perspective. This builds trust and ensures you address the real issue.",
      },
      {
        title: "Structured Opening",
        summary:
          "Open with intent: state the purpose of the conversation, acknowledge the other person\u2019s perspective, and align on what a good outcome looks like before diving into details.",
      },
    ],
  };
}

export default function StepTemplateContext({
  context,
  onContextChange,
  onTemplateSelect,
}: {
  context: WizardContext;
  onContextChange: (updates: Partial<WizardContext>) => void;
  onTemplateSelect: (template: CoachableTemplate) => void;
}) {
  const [customMode, setCustomMode] = useState(
    context.template?.id === "custom"
  );
  const [customDescription, setCustomDescription] = useState(
    context.template?.id === "custom" ? context.template.description : ""
  );

  const template = context.template;
  const hasTemplate = template !== null;

  // Speech recognition for the "Additional context" textarea
  const handleTranscript = useCallback(
    (text: string) => {
      const prev = context.additionalContext.trim();
      const separator = prev ? " " : "";
      onContextChange({ additionalContext: prev + separator + text });
    },
    [context.additionalContext, onContextChange]
  );

  const { isSupported, isListening, interimTranscript, toggleListening } =
    useSpeechRecognition({ onTranscript: handleTranscript });

  const displayValue =
    isListening && interimTranscript
      ? context.additionalContext +
        (context.additionalContext.trim() ? " " : "") +
        interimTranscript
      : context.additionalContext;

  const handleCustomToggle = () => {
    setCustomMode(true);
    if (customDescription.trim()) {
      onTemplateSelect(makeCustomTemplate(customDescription.trim()));
    }
  };

  const handleCustomDescriptionChange = (value: string) => {
    setCustomDescription(value);
    if (value.trim()) {
      onTemplateSelect(makeCustomTemplate(value.trim()));
    }
  };

  const handleTemplateSelect = (t: CoachableTemplate) => {
    setCustomMode(false);
    setCustomDescription("");
    onTemplateSelect(t);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 pt-8 pb-6 sm:pt-10 sm:pb-8">
      {/* Header */}
      <div className="text-center mb-6 animate-fade-up">
        <h2
          className="text-xl sm:text-2xl font-bold text-text-primary mb-2"
          style={{ letterSpacing: "-0.02em" }}
        >
          What conversation are you preparing for?
        </h2>
        <p className="text-text-secondary text-sm leading-relaxed max-w-lg mx-auto">
          Pick a template and add any details to personalize your prep.
        </p>
      </div>

      {/* Template grid — always-colored icons */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 gap-2 animate-fade-up"
        style={{ animationDelay: "0.1s" }}
      >
        {COACHABLE_TEMPLATES.map((t, i) => {
          const Icon = getIcon(t.icon);
          const isSelected = !customMode && template?.id === t.id;

          return (
            <button
              key={t.id}
              onClick={() => handleTemplateSelect(t)}
              className={`
                group relative flex items-start gap-3.5 p-3.5 rounded-lg
                border transition-all duration-200 ease-out text-left
                animate-fade-up-sm stagger-${Math.min(i + 1, 6)}
                ${
                  isSelected
                    ? "border-brand-700 bg-brand-50 shadow-sm"
                    : "border-border bg-surface hover:border-brand-300 hover:bg-brand-50"
                }
              `}
            >
              {/* Selection checkmark */}
              {isSelected && (
                <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full gradient-brand flex items-center justify-center">
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={3}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m4.5 12.75 6 6 9-13.5"
                    />
                  </svg>
                </div>
              )}

              {/* Always-colored icon */}
              <div
                className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${t.color} ${
                  isSelected
                    ? "shadow-md ring-2 ring-offset-1 ring-brand-300 scale-105"
                    : "opacity-70 group-hover:opacity-90 group-hover:shadow-sm"
                }`}
              >
                <Icon className="w-5 h-5 text-white relative z-10" />
              </div>

              <div className="min-w-0 pt-0.5 pr-6">
                <p className="text-sm font-semibold text-text-primary">
                  {t.title}
                </p>
                <p className="text-xs text-text-tertiary mt-0.5 leading-relaxed">
                  {t.description}
                </p>
                {t.learningConcepts.some((c) => c.framework) && (
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {t.learningConcepts
                      .filter((c) => c.framework)
                      .map((c) => (
                        <span
                          key={c.framework}
                          className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-brand-50 text-brand-600 border border-brand-200"
                        >
                          {c.framework}
                        </span>
                      ))}
                  </div>
                )}
              </div>
            </button>
          );
        })}

        {/* Custom conversation option */}
        <button
          onClick={handleCustomToggle}
          className={`
            group relative flex items-start gap-3.5 p-3.5 rounded-lg
            border transition-all duration-200 ease-out text-left sm:col-span-2
            ${
              customMode
                ? "border-brand-700 bg-brand-50 shadow-sm"
                : "border-dashed border-border bg-surface hover:border-brand-300 hover:bg-brand-50"
            }
          `}
        >
          {customMode && (
            <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full gradient-brand flex items-center justify-center">
              <svg
                className="w-3 h-3 text-white"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={3}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m4.5 12.75 6 6 9-13.5"
                />
              </svg>
            </div>
          )}

          <div
            className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 accent-violet ${
              customMode
                ? "shadow-md ring-2 ring-offset-1 ring-brand-300 scale-105"
                : "opacity-70 group-hover:opacity-90 group-hover:shadow-sm"
            }`}
          >
            <PencilIcon className="w-5 h-5 text-white relative z-10" />
          </div>
          <div className="min-w-0 pt-0.5 pr-6">
            <p className="text-sm font-semibold text-text-primary">
              Something else
            </p>
            <p className="text-xs text-text-tertiary mt-0.5 leading-relaxed">
              Describe any type of management conversation you&apos;re preparing
              for
            </p>
          </div>
        </button>
      </div>

      {/* Custom description input */}
      {customMode && (
        <div className="mt-3 animate-fade-up-sm">
          <textarea
            value={customDescription}
            onChange={(e) => handleCustomDescriptionChange(e.target.value)}
            placeholder="e.g., Having a career growth conversation with a senior engineer who wants to move into management..."
            rows={3}
            autoFocus
            className="w-full px-4 py-3 rounded-lg border border-brand-300 bg-surface text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-brand-700 transition-all resize-none"
          />
        </div>
      )}

      {/* Framework primer — expandable learning moment */}
      {hasTemplate && !customMode && template.learningConcepts.length > 0 && (
        <FrameworkPrimer concepts={template.learningConcepts} />
      )}

      {/* Context fields — appear when template is selected */}
      {(hasTemplate || customMode) && (
        <div className="mt-6 pt-6 border-t border-border space-y-4 animate-fade-up-sm">
          <p className="text-sm font-semibold text-text-primary">
            Add details{" "}
            <span className="text-text-tertiary font-normal">
              (optional &mdash; improves your prep)
            </span>
          </p>

          {/* Two-column row: Attendees + Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm-caps text-text-tertiary mb-1.5">
                Who is this with?
              </label>
              <input
                type="text"
                value={context.attendees}
                onChange={(e) =>
                  onContextChange({ attendees: e.target.value })
                }
                placeholder="e.g., Sarah Chen — Senior Engineer"
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-surface text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-brand-700 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm-caps text-text-tertiary mb-1.5">
                When?
              </label>
              <input
                type="date"
                value={context.dateTime}
                onChange={(e) =>
                  onContextChange({ dateTime: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-surface text-sm text-text-primary focus:outline-none focus:border-brand-700 transition-all"
              />
            </div>
          </div>

          {/* Desired outcome */}
          <div>
            <label className="block text-sm-caps text-text-tertiary mb-1.5">
              Desired outcome
            </label>
            <input
              type="text"
              value={context.desiredOutcome}
              onChange={(e) =>
                onContextChange({ desiredOutcome: e.target.value })
              }
              placeholder="e.g., Agree on a clear improvement plan..."
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-surface text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-brand-700 transition-all"
            />
          </div>

          {/* Additional context with mic */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm-caps text-text-tertiary">
                Additional context
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
            <div
              className={`relative rounded-lg border transition-all ${
                isListening ? "border-red-300" : "border-border"
              }`}
            >
              <textarea
                value={displayValue}
                onChange={(e) => {
                  if (!isListening || !interimTranscript) {
                    onContextChange({ additionalContext: e.target.value });
                  }
                }}
                placeholder={
                  isListening
                    ? "Listening \u2014 speak naturally..."
                    : "e.g., This person has been defensive in past feedback conversations..."
                }
                rows={4}
                className={`w-full px-4 py-2.5 rounded-lg bg-surface text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none transition-all resize-none ${
                  isListening && interimTranscript ? "text-text-secondary" : ""
                }`}
              />
              <div className="absolute bottom-2 right-2">
                <MicButton
                  isListening={isListening}
                  isSupported={isSupported}
                  onClick={toggleListening}
                  variant="compact"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
