"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { SparklesIcon, PlusIcon, getIcon } from "./Icons";
import { getRelativeTime, getAccentClass } from "@/lib/utils";

interface SessionSummary {
  id: string;
  templateId: string | null;
  templateTitle: string | null;
  context: Record<string, unknown> | null;
  createdAt: string;
}

interface SidebarProps {
  user: {
    name?: string | null;
    image?: string | null;
    email?: string | null;
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ user, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [sessions, setSessions] = useState<SessionSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Fetch sessions on mount and when pathname changes (e.g., after saving)
  useEffect(() => {
    fetch("/api/sessions")
      .then((res) => (res.ok ? res.json() : []))
      .then(setSessions)
      .catch(() => setSessions([]))
      .finally(() => setLoading(false));
  }, [pathname]);

  // Filter sessions by search term
  const filtered = sessions.filter((s) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    const title = (s.templateTitle || "").toLowerCase();
    const ctx = s.context as Record<string, unknown> | null;
    const attendees = ((ctx?.attendees as string) || "").toLowerCase();
    return title.includes(q) || attendees.includes(q);
  });

  // Active session from URL
  const activeSessionId = pathname.startsWith("/dashboard/")
    ? pathname.split("/")[2]
    : null;

  const isOnCoach = pathname === "/coach";

  const handleNewSession = () => {
    onClose();
    router.push("/coach");
  };

  return (
    <aside
      className={`
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
        fixed md:static inset-y-0 left-0 z-40
        w-[280px] flex-shrink-0
        flex flex-col
        border-r border-border bg-surface
        transition-transform duration-200 ease-out
      `}
    >
      {/* Branding */}
      <div className="flex items-center gap-3 px-4 pt-4 pb-3">
        <Link href="/" className="flex items-center gap-3" onClick={onClose}>
          <div className="w-9 h-9 rounded-xl gradient-brand flex items-center justify-center">
            <SparklesIcon className="w-[18px] h-[18px] text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-text-primary tracking-tight">
              AI Coach
            </h1>
            <p className="text-[11px] text-text-tertiary leading-tight">
              Leadership coaching
            </p>
          </div>
        </Link>
      </div>

      {/* New Session button */}
      <div className="px-3 pb-3">
        <button
          onClick={handleNewSession}
          className={`
            w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all
            ${
              isOnCoach
                ? "bg-brand-50 border border-brand-200 text-text-primary"
                : "gradient-brand text-white hover:opacity-90"
            }
          `}
        >
          <PlusIcon className="w-4 h-4" />
          New Session
        </button>
      </div>

      {/* Search */}
      <div className="px-3 pb-2">
        <input
          type="text"
          placeholder="Search sessions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-border bg-surface-secondary text-xs text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-brand-300 transition-all"
        />
      </div>

      {/* Session list */}
      <div className="flex-1 overflow-y-auto px-2 py-1 sidebar-sessions">
        {/* Section label */}
        <p className="text-sm-caps text-text-tertiary px-2 pt-1 pb-2">
          Sessions
        </p>

        {loading && (
          <div className="flex justify-center py-8">
            <div className="thinking-dots flex items-center gap-0.5">
              <span />
              <span />
              <span />
            </div>
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <p className="text-xs text-text-tertiary text-center py-6 px-2">
            {search ? "No matching sessions" : "No sessions yet — start your first one!"}
          </p>
        )}

        {!loading &&
          filtered.map((s) => {
            const ctx = s.context as Record<string, unknown> | null;
            const templateData = ctx?.template as Record<string, unknown> | null;
            const accentClass = getAccentClass(templateData);
            const attendees = (ctx?.attendees as string) || "";
            const isActive = s.id === activeSessionId;

            return (
              <Link
                key={s.id}
                href={`/dashboard/${s.id}`}
                onClick={onClose}
                className={`
                  flex items-start gap-3 px-3 py-2.5 rounded-lg mb-0.5 transition-colors
                  ${
                    isActive
                      ? "bg-brand-50 border border-brand-200"
                      : "hover:bg-brand-50/50 border border-transparent"
                  }
                `}
              >
                <div
                  className={`w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1.5 ${accentClass}`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary truncate leading-tight">
                    {s.templateTitle || "Coaching Session"}
                  </p>
                  <p className="text-[11px] text-text-tertiary truncate mt-0.5">
                    {attendees ? `${attendees} · ` : ""}
                    {getRelativeTime(s.createdAt)}
                  </p>
                </div>
              </Link>
            );
          })}
      </div>

      {/* User section at bottom */}
      {user && (
        <div className="border-t border-border px-3 py-3">
          <div className="flex items-center gap-3">
            {user.image ? (
              <img
                src={user.image}
                alt=""
                className="w-8 h-8 rounded-full border border-border"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-brand-50 border border-brand-200 flex items-center justify-center">
                <span className="text-xs font-bold text-brand-700">
                  {(user.name || user.email || "U")[0].toUpperCase()}
                </span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-primary truncate">
                {user.name}
              </p>
              <p className="text-[11px] text-text-tertiary truncate">
                {user.email}
              </p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-text-tertiary hover:text-red-500 transition-colors"
              title="Sign out"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}
