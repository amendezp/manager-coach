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
  showSkipRehearsal,
  onSkipRehearsal,
}: {
  currentStep: number;
  canAdvance: boolean;
  onBack: () => void;
  onNext: () => void;
  onSkip?: () => void;
  nextLabel?: string;
  showSkip?: boolean;
  showSkipRehearsal?: boolean;
  onSkipRehearsal?: () => void;
}) {
  return (
    <div className="flex-shrink-0 border-t border-border bg-surface/80 backdrop-blur-lg px-4 py-3">
      <div className="max-w-3xl mx-auto flex items-center justify-between">
        {/* Back — underlined text link */}
        {currentStep > 1 ? (
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-text-primary underline underline-offset-4 decoration-brand-200 hover:decoration-brand-400 transition-all duration-200"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            <span>Back</span>
          </button>
        ) : (
          <div />
        )}

        {/* Right side: skip + skip rehearsal + next */}
        <div className="flex items-center gap-2">
          {showSkip && onSkip && (
            <button
              onClick={onSkip}
              className="px-4 py-2 rounded-lg text-sm font-medium text-text-tertiary hover:text-text-secondary hover:bg-brand-50 transition-all duration-200"
            >
              Skip
            </button>
          )}
          {showSkipRehearsal && onSkipRehearsal && (
            <button
              onClick={onSkipRehearsal}
              className="px-4 py-2 rounded-lg text-sm font-medium text-text-secondary hover:text-text-primary underline underline-offset-4 decoration-brand-200 hover:decoration-brand-400 transition-all duration-200"
            >
              Skip to prep sheet
            </button>
          )}
          <button
            onClick={onNext}
            disabled={!canAdvance}
            className={`
              flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 active:scale-[0.98]
              ${
                canAdvance
                  ? "gradient-brand text-white hover:opacity-90"
                  : "bg-brand-100 text-brand-300 cursor-not-allowed"
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
