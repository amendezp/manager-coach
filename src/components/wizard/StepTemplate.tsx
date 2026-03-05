"use client";

import { COACHABLE_TEMPLATES } from "@/lib/templates";
import { getIcon } from "../Icons";
import type { CoachableTemplate } from "@/lib/types";

export default function StepTemplate({
  selected,
  onSelect,
}: {
  selected: CoachableTemplate | null;
  onSelect: (template: CoachableTemplate) => void;
}) {
  return (
    <div className="max-w-2xl mx-auto px-4 pt-8 pb-6 sm:pt-10 sm:pb-8">
      <div className="text-center mb-8 animate-fade-up">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-text-primary mb-2">
          What type of conversation are you preparing for?
        </h2>
        <p className="text-text-secondary text-sm leading-relaxed max-w-lg mx-auto">
          Select the coachable moment that best matches your upcoming interaction.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-fade-up" style={{ animationDelay: "0.1s" }}>
        {COACHABLE_TEMPLATES.map((template, i) => {
          const Icon = getIcon(template.icon);
          const isSelected = selected?.id === template.id;

          return (
            <button
              key={template.id}
              onClick={() => onSelect(template)}
              className={`
                group relative flex items-start gap-3.5 p-4 rounded-xl
                border transition-all duration-200 ease-out text-left
                animate-fade-up-sm stagger-${Math.min(i + 1, 6)}
                ${
                  isSelected
                    ? "border-brand-400 bg-brand-50 shadow-md shadow-brand-100/50 -translate-y-0.5"
                    : "border-border/80 bg-surface hover:border-brand-200 hover:shadow-md hover:shadow-brand-100/50 hover:-translate-y-0.5"
                }
                active:translate-y-0 active:shadow-sm
              `}
            >
              {/* Selection indicator */}
              {isSelected && (
                <div className="absolute top-3 right-3 w-5 h-5 rounded-full gradient-brand flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                </div>
              )}

              <div
                className={`flex-shrink-0 w-10 h-10 rounded-xl border flex items-center justify-center transition-colors duration-200 ${
                  isSelected
                    ? "bg-brand-100 border-brand-200"
                    : "bg-brand-50 border-brand-100/80 group-hover:bg-brand-100 group-hover:border-brand-200"
                }`}
              >
                <Icon className={`w-5 h-5 ${isSelected ? "text-brand-700" : "text-brand-600"}`} />
              </div>
              <div className="min-w-0 pt-0.5 pr-6">
                <p
                  className={`text-sm font-semibold transition-colors duration-200 ${
                    isSelected ? "text-brand-700" : "text-text-primary group-hover:text-brand-700"
                  }`}
                >
                  {template.title}
                </p>
                <p className="text-xs text-text-tertiary mt-0.5 leading-relaxed">
                  {template.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
