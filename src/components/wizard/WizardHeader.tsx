"use client";

import { CheckIcon } from "../Icons";
import type { WizardStep } from "@/lib/types";

const STEPS: { step: WizardStep; label: string; shortLabel: string }[] = [
  { step: 1, label: "Calendar", shortLabel: "Cal" },
  { step: 2, label: "Prepare", shortLabel: "Prep" },
  { step: 3, label: "Learn", shortLabel: "Learn" },
  { step: 4, label: "Rehearse", shortLabel: "Play" },
  { step: 5, label: "Debrief", shortLabel: "Doc" },
];

export default function WizardHeader({
  currentStep,
  onStepClick,
}: {
  currentStep: WizardStep;
  onStepClick?: (step: WizardStep) => void;
}) {
  return (
    <header className="flex-shrink-0 border-b border-border bg-surface/80 backdrop-blur-xl px-4 py-2.5 z-10">
      <div className="max-w-3xl mx-auto">
        {/* Step indicator */}
        <div className="flex items-center gap-1">
          {STEPS.map(({ step, label, shortLabel }, i) => {
            const isCompleted = step < currentStep;
            const isCurrent = step === currentStep;
            const isFuture = step > currentStep;
            const isClickable = isCompleted && onStepClick;

            return (
              <div key={step} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => isClickable && onStepClick(step)}
                    disabled={!isClickable}
                    className={`
                      w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300
                      ${isCompleted ? "gradient-brand text-white" : ""}
                      ${isCurrent ? "gradient-brand text-white" : ""}
                      ${isFuture ? "bg-brand-50 text-text-tertiary border border-brand-200" : ""}
                      ${isClickable ? "cursor-pointer hover:opacity-80 hover:ring-2 hover:ring-brand-300 hover:ring-offset-1" : ""}
                      ${!isClickable && !isCurrent ? "cursor-default" : ""}
                    `}
                  >
                    {isCompleted ? (
                      <CheckIcon className="w-3.5 h-3.5" />
                    ) : (
                      step
                    )}
                  </button>
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
