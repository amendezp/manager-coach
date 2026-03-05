"use client";

import { ArrowLeftIcon, ArrowRightIcon } from "../Icons";

export default function WizardNav({
  currentStep,
  canAdvance,
  onBack,
  onNext,
  onSkip,
  nextLabel,
  showSkip,
}: {
  currentStep: number;
  canAdvance: boolean;
  onBack: () => void;
  onNext: () => void;
  onSkip?: () => void;
  nextLabel?: string;
  showSkip?: boolean;
}) {
  return (
    <div className="flex-shrink-0 border-t border-border/60 bg-surface/80 backdrop-blur-lg px-4 py-3">
      <div className="max-w-3xl mx-auto flex items-center justify-between">
        {/* Back */}
        {currentStep > 1 ? (
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-surface-tertiary transition-all duration-200 active:scale-95"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            <span>Back</span>
          </button>
        ) : (
          <div />
        )}

        {/* Right side: skip + next */}
        <div className="flex items-center gap-2">
          {showSkip && onSkip && (
            <button
              onClick={onSkip}
              className="px-4 py-2 rounded-xl text-sm font-medium text-text-tertiary hover:text-text-secondary hover:bg-surface-tertiary transition-all duration-200"
            >
              Skip
            </button>
          )}
          <button
            onClick={onNext}
            disabled={!canAdvance}
            className={`
              flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-95
              ${
                canAdvance
                  ? "gradient-brand text-white shadow-sm shadow-brand-200/30 hover:shadow-md hover:shadow-brand-200/40"
                  : "bg-surface-tertiary text-text-tertiary cursor-not-allowed"
              }
            `}
          >
            <span>{nextLabel || "Next"}</span>
            <ArrowRightIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
