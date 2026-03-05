"use client";

import Link from "next/link";
import { ArrowLeftIcon, PlusIcon } from "./Icons";

export default function FlowHeader({
  title,
  subtitle,
  icon,
  sessionStarted,
  onNewSession,
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  sessionStarted: boolean;
  onNewSession: () => void;
}) {
  return (
    <header className="flex-shrink-0 border-b border-border bg-surface/80 backdrop-blur-xl px-4 py-3 z-10">
      <div className="max-w-3xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-brand-50 transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4 text-text-secondary" />
          </Link>
          <div className="w-9 h-9 rounded-xl gradient-brand flex items-center justify-center">
            {icon}
          </div>
          <div>
            <h1 className="text-sm font-bold text-text-primary tracking-tight">
              {title}
            </h1>
            <p className="text-[11px] text-text-tertiary leading-tight">
              {subtitle}
            </p>
          </div>
        </div>

        {sessionStarted && (
          <button
            onClick={onNewSession}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-text-secondary hover:text-text-primary bg-brand-50 hover:bg-brand-100 border border-brand-200 transition-all duration-200 active:scale-[0.98]"
          >
            <PlusIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New</span>
          </button>
        )}
      </div>
    </header>
  );
}
