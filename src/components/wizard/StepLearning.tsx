"use client";

import type { CoachableTemplate } from "@/lib/types";
import { BookIcon } from "../Icons";

export default function StepLearning({
  template,
}: {
  template: CoachableTemplate;
}) {
  return (
    <div className="max-w-2xl mx-auto px-4 pt-8 pb-6 sm:pt-10 sm:pb-8">
      <div className="text-center mb-8 animate-fade-up">
        <div className="relative inline-flex items-center justify-center mb-4">
          <div className="absolute inset-0 w-12 h-12 rounded-xl bg-emerald-200/40 blur-xl" />
          <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-md shadow-emerald-200/30">
            <BookIcon className="w-5 h-5 text-white" />
          </div>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-text-primary mb-2">
          Quick Learning Moment
        </h2>
        <p className="text-text-secondary text-sm leading-relaxed max-w-lg mx-auto">
          Before you rehearse, here are key frameworks relevant to{" "}
          <strong className="text-text-primary">{template.title.toLowerCase()}</strong>.
        </p>
      </div>

      <div className="space-y-4 animate-fade-up" style={{ animationDelay: "0.1s" }}>
        {template.learningConcepts.map((concept, i) => (
          <div
            key={i}
            className={`p-5 rounded-2xl border border-border/80 bg-surface shadow-sm animate-fade-up-sm stagger-${i + 1}`}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center mt-0.5">
                <span className="text-sm font-bold text-emerald-600">
                  {i + 1}
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <h3 className="text-sm font-bold text-text-primary">
                    {concept.title}
                  </h3>
                  {concept.framework && (
                    <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
                      {concept.framework}
                    </span>
                  )}
                </div>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {concept.summary}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-8 animate-fade-in" style={{ animationDelay: "0.3s" }}>
        <p className="text-xs text-text-tertiary">
          Keep these frameworks in mind during your rehearsal — the AI coach
          will reference them too
        </p>
      </div>
    </div>
  );
}
