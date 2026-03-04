"use client";

import Link from "next/link";
import {
  SparklesIcon,
  CalendarIcon,
  ChatBubbleIcon,
  AcademicCapIcon,
} from "@/components/Icons";

const flows = [
  {
    href: "/copilot",
    title: "1:1 Co-Pilot",
    description:
      "Prepare structured agendas using the OSKAR framework and turn post-meeting notes into polished, professional feedback.",
    icon: CalendarIcon,
    color: "brand",
    gradient: "from-brand-600 to-brand-500",
    bgLight: "bg-brand-50",
    borderLight: "border-brand-100/80",
    hoverBg: "group-hover:bg-brand-100",
    hoverBorder: "group-hover:border-brand-200",
    iconColor: "text-brand-600",
    hoverText: "group-hover:text-brand-700",
    dot: "bg-brand-500",
    tag: "Meeting Prep",
  },
  {
    href: "/simulator",
    title: "Scenario Simulator",
    description:
      "Practice high-stakes conversations in interactive role-plays. The AI adopts a realistic persona and scores your performance.",
    icon: ChatBubbleIcon,
    color: "amber",
    gradient: "from-amber-500 to-orange-500",
    bgLight: "bg-amber-50",
    borderLight: "border-amber-100/80",
    hoverBg: "group-hover:bg-amber-100",
    hoverBorder: "group-hover:border-amber-200",
    iconColor: "text-amber-600",
    hoverText: "group-hover:text-amber-700",
    dot: "bg-amber-400",
    tag: "Role-Play",
  },
  {
    href: "/reflect",
    title: "Weekly Reflection",
    description:
      "Process your week with a coaching companion who asks the right questions and delivers personalized micro-learning pills.",
    icon: AcademicCapIcon,
    color: "emerald",
    gradient: "from-emerald-500 to-teal-500",
    bgLight: "bg-emerald-50",
    borderLight: "border-emerald-100/80",
    hoverBg: "group-hover:bg-emerald-100",
    hoverBorder: "group-hover:border-emerald-200",
    iconColor: "text-emerald-600",
    hoverText: "group-hover:text-emerald-700",
    dot: "bg-emerald-400",
    tag: "Micro-Learning",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-dvh bg-surface-secondary">
      {/* Header */}
      <header className="border-b border-border/60 bg-surface/70 backdrop-blur-xl px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl gradient-brand flex items-center justify-center shadow-sm shadow-brand-200/30">
            <SparklesIcon className="w-[18px] h-[18px] text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-text-primary tracking-tight">
              AI Coach
            </h1>
            <p className="text-[11px] text-text-tertiary leading-tight">
              Leadership coaching for middle managers
            </p>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="max-w-4xl mx-auto px-4 pt-10 sm:pt-16 pb-6">
        <div className="text-center mb-12 animate-fade-up">
          <div className="relative inline-flex items-center justify-center mb-6">
            <div className="absolute inset-0 w-20 h-20 rounded-3xl bg-brand-200/40 blur-2xl" />
            <div className="relative w-16 h-16 rounded-2xl gradient-brand flex items-center justify-center shadow-xl shadow-brand-500/20">
              <SparklesIcon className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-text-primary mb-4">
            Your AI Leadership Coach
          </h2>
          <p className="text-text-secondary text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            In-the-moment coaching designed for the &ldquo;frozen middle.&rdquo;
            Prepare for 1:1s, rehearse hard conversations, and build repeatable
            management habits.
          </p>
        </div>

        {/* Flow Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 mb-12">
          {flows.map((flow, i) => {
            const Icon = flow.icon;
            return (
              <Link
                key={flow.href}
                href={flow.href}
                className={`
                  group relative flex flex-col p-6 rounded-2xl
                  border border-border/80 bg-surface
                  hover:shadow-lg hover:-translate-y-1
                  active:translate-y-0 active:shadow-md
                  transition-all duration-300 ease-out
                  animate-fade-up-sm stagger-${i + 1}
                `}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`w-11 h-11 rounded-xl ${flow.bgLight} border ${flow.borderLight} flex items-center justify-center ${flow.hoverBg} ${flow.hoverBorder} transition-colors duration-200`}
                  >
                    <Icon className={`w-5 h-5 ${flow.iconColor}`} />
                  </div>
                  <span
                    className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${flow.bgLight} ${flow.iconColor}`}
                  >
                    {flow.tag}
                  </span>
                </div>

                <h3
                  className={`text-lg font-bold text-text-primary ${flow.hoverText} transition-colors duration-200 mb-2`}
                >
                  {flow.title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed flex-1">
                  {flow.description}
                </p>

                <div className="flex items-center gap-1.5 mt-4 text-xs font-medium text-text-tertiary group-hover:text-text-secondary transition-colors">
                  <span>Get started</span>
                  <svg
                    className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m8.25 4.5 7.5 7.5-7.5 7.5"
                    />
                  </svg>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Footer */}
        <div className="text-center pb-8 animate-fade-in" style={{ animationDelay: "0.4s" }}>
          <p className="text-xs text-text-tertiary">
            All conversations are private, confidential, and stateless &mdash;
            no data is stored or retained.
          </p>
        </div>
      </div>
    </div>
  );
}
