"use client";

import Link from "next/link";
import { ArrowLeftIcon, CheckIcon, SparklesIcon } from "../Icons";
import type { WizardStep } from "@/lib/types";

const STEPS: { step: WizardStep; label: string; shortLabel: string }[] = [
  { step: 1, label: "Calendar", shortLabel: "Cal" },
  { step: 2, label: "Template", shortLabel: "Type" },
  { step: 3, label: "Context", shortLabel: "Info" },
  { step: 4, label: "Learn", shortLabel: "Learn" },
  { step: 5, label: "Rehearse", shortLabel: "Prep" },
  { step: 6, label: "Debrief", shortLabel: "Doc" },
];

export default function WizardHeader({
  currentStep,
}: {
  currentStep: WizardStep;
}) {
  return (
    <header className="flex-shrink-0 border-b border-border bg-surface/80 backdrop-blur-xl px-4 py-3 z-10">
      <div className="max-w-3xl mx-auto">
        {/* Top row: back + title */}
        <div className="flex items-center gap-3 mb-3">
          <Link
            href="/"
            className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-brand-50 transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4 text-text-secondary" />
          </Link>
          <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center">
            <SparklesIcon className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-text-primary tracking-tight">
              Conversation Coach
            </h1>
            <p className="text-[11px] text-text-tertiary leading-tight">
              Step {currentStep} of 6
            </p>
          </div>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-1">
          {STEPS.map(({ step, label, shortLabel }, i) => {
            const isCompleted = step < currentStep;
            const isCurrent = step === currentStep;
            const isFuture = step > currentStep;

            return (
              <div key={step} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center gap-1 flex-shrink-0">
                  <div
                    className={`
                      w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300
                      ${isCompleted ? "gradient-brand text-white" : ""}
                      ${isCurrent ? "gradient-brand text-white" : ""}
                      ${isFuture ? "bg-brand-50 text-text-tertiary border border-brand-200" : ""}
                    `}
                  >
                    {isCompleted ? (
                      <CheckIcon className="w-3.5 h-3.5" />
                    ) : (
                      step
                    )}
                  </div>
                  <span
                    className={`text-[9px] font-medium tracking-wide uppercase transition-colors duration-300 hidden sm:block ${
                      isCurrent
                        ? "text-text-primary"
                        : isCompleted
                          ? "text-text-secondary"
                          : "text-text-tertiary"
                    }`}
                  >
                    {label}
                  </span>
                  <span
                    className={`text-[9px] font-medium tracking-wide uppercase transition-colors duration-300 sm:hidden ${
                      isCurrent
                        ? "text-text-primary"
                        : isCompleted
                          ? "text-text-secondary"
                          : "text-text-tertiary"
                    }`}
                  >
                    {shortLabel}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-1.5 rounded-full transition-colors duration-300 ${
                      step < currentStep ? "bg-brand-700" : "bg-brand-200"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </header>
  );
}
