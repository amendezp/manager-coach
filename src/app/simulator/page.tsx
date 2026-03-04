"use client";

import ChatInterface from "@/components/ChatInterface";
import { ChatBubbleIcon, getIcon } from "@/components/Icons";
import { SIMULATOR_SCENARIOS } from "@/lib/scenarios";

function WelcomeContent({
  onSelectScenario,
}: {
  onSelectScenario: (prompt: string) => void;
}) {
  return (
    <div className="max-w-2xl mx-auto px-4 pt-8 pb-6 sm:pt-14 sm:pb-8">
      <div className="text-center mb-10 animate-fade-up">
        <div className="relative inline-flex items-center justify-center mb-6">
          <div className="absolute inset-0 w-16 h-16 rounded-2xl bg-amber-200/40 blur-xl" />
          <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <ChatBubbleIcon className="w-7 h-7 text-white" />
          </div>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary mb-3">
          Scenario Simulator
        </h1>
        <p className="text-text-secondary text-sm sm:text-base leading-relaxed max-w-lg mx-auto">
          Practice high-stakes conversations in a safe environment. The AI plays
          the other person and gives you a scorecard when you&apos;re done.
        </p>
      </div>

      <div className="mb-8 animate-fade-up" style={{ animationDelay: "0.1s" }}>
        <div className="flex items-center gap-2.5 mb-3.5 px-1">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-amber-400" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-text-tertiary">
              Choose a scenario to practice
            </h2>
          </div>
          <div className="flex-1 h-px bg-border" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SIMULATOR_SCENARIOS.map((scenario, i) => {
            const Icon = getIcon(scenario.icon);
            return (
              <button
                key={scenario.id}
                onClick={() => onSelectScenario(scenario.prompt)}
                className={`
                  group relative flex items-start gap-3.5 p-4 rounded-xl
                  border border-border/80 bg-surface
                  hover:border-amber-200 hover:shadow-md hover:shadow-amber-100/50
                  hover:-translate-y-0.5
                  active:translate-y-0 active:shadow-sm
                  transition-all duration-200 ease-out text-left
                  animate-fade-up-sm stagger-${i + 1}
                `}
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-amber-50 border border-amber-100/80 flex items-center justify-center group-hover:bg-amber-100 group-hover:border-amber-200 transition-colors duration-200">
                  <Icon className="w-5 h-5 text-amber-600" />
                </div>
                <div className="min-w-0 pt-0.5">
                  <p className="text-sm font-semibold text-text-primary group-hover:text-amber-700 transition-colors duration-200">
                    {scenario.title}
                  </p>
                  <p className="text-xs text-text-tertiary mt-0.5 leading-relaxed">
                    {scenario.description}
                  </p>
                </div>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
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
          Or describe any management scenario you want to practice &mdash; your
          conversations are private and confidential
        </p>
      </div>
    </div>
  );
}

export default function SimulatorPage() {
  return (
    <ChatInterface
      flow="simulator"
      title="Scenario Simulator"
      subtitle="Practice hard conversations"
      icon={<ChatBubbleIcon className="w-[18px] h-[18px] text-white" />}
      placeholder="Describe the conversation you want to practice..."
      renderWelcome={(onSelect) => <WelcomeContent onSelectScenario={onSelect} />}
    />
  );
}
