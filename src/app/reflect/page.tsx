"use client";

import ChatInterface from "@/components/ChatInterface";
import { AcademicCapIcon, getIcon } from "@/components/Icons";
import { REFLECT_SCENARIOS } from "@/lib/scenarios";

function WelcomeContent({
  onSelectScenario,
}: {
  onSelectScenario: (prompt: string) => void;
}) {
  return (
    <div className="max-w-2xl mx-auto px-4 pt-8 pb-6 sm:pt-14 sm:pb-8">
      <div className="text-center mb-10 animate-fade-up">
        <div className="relative inline-flex items-center justify-center mb-6">
          <div className="absolute inset-0 w-16 h-16 rounded-2xl bg-emerald-200/40 blur-xl" />
          <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <AcademicCapIcon className="w-7 h-7 text-white" />
          </div>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary mb-3">
          Weekly Reflection
        </h1>
        <p className="text-text-secondary text-sm sm:text-base leading-relaxed max-w-lg mx-auto">
          Reflect on your week, process what happened, and get a personalized
          &ldquo;learning pill&rdquo; tailored to your real challenges.
        </p>
      </div>

      <div className="mb-8 animate-fade-up" style={{ animationDelay: "0.1s" }}>
        <div className="flex items-center gap-2.5 mb-3.5 px-1">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-text-tertiary">
              Start a reflection
            </h2>
          </div>
          <div className="flex-1 h-px bg-border" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {REFLECT_SCENARIOS.map((scenario, i) => {
            const Icon = getIcon(scenario.icon);
            return (
              <button
                key={scenario.id}
                onClick={() => onSelectScenario(scenario.prompt)}
                className={`
                  group relative flex items-start gap-3.5 p-4 rounded-xl
                  border border-border/80 bg-surface
                  hover:border-emerald-200 hover:shadow-md hover:shadow-emerald-100/50
                  hover:-translate-y-0.5
                  active:translate-y-0 active:shadow-sm
                  transition-all duration-200 ease-out text-left
                  animate-fade-up-sm stagger-${i + 1}
                `}
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100/80 flex items-center justify-center group-hover:bg-emerald-100 group-hover:border-emerald-200 transition-colors duration-200">
                  <Icon className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="min-w-0 pt-0.5">
                  <p className="text-sm font-semibold text-text-primary group-hover:text-emerald-700 transition-colors duration-200">
                    {scenario.title}
                  </p>
                  <p className="text-xs text-text-tertiary mt-0.5 leading-relaxed">
                    {scenario.description}
                  </p>
                </div>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                  </svg>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="text-center animate-fade-in" style={{ animationDelay: "0.3s" }}>
        <p className="text-xs text-text-tertiary">
          Or just share how your week went &mdash; your conversations are
          private and confidential
        </p>
      </div>
    </div>
  );
}

export default function ReflectPage() {
  return (
    <ChatInterface
      flow="reflect"
      title="Weekly Reflection"
      subtitle="Reflect, learn, grow"
      icon={<AcademicCapIcon className="w-[18px] h-[18px] text-white" />}
      placeholder="How was your week as a manager?"
      renderWelcome={(onSelect) => <WelcomeContent onSelectScenario={onSelect} />}
    />
  );
}
