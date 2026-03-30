"use client";

import { useState, useEffect, useRef } from "react";
import type { TeamMember } from "@/lib/types";

interface TeamMemberPickerProps {
  attendees: string;
  teamMemberId?: string | null;
  onChange: (updates: { attendees: string; teamMemberId?: string | null }) => void;
  isGuest: boolean;
}

export default function TeamMemberPicker({
  attendees,
  teamMemberId,
  onChange,
  isGuest,
}: TeamMemberPickerProps) {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isManual, setIsManual] = useState(false);
  const [filter, setFilter] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isGuest) return;
    fetch("/api/team-members")
      .then((res) => (res.ok ? res.json() : []))
      .then(setMembers)
      .catch(() => setMembers([]));
  }, [isGuest]);

  // If no team members exist or guest, default to manual mode
  const useManual = isGuest || isManual || members.length === 0;

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Find selected member name
  const selectedMember = teamMemberId
    ? members.find((m) => m.id === teamMemberId)
    : null;

  const filteredMembers = members.filter((m) => {
    if (!filter) return true;
    const q = filter.toLowerCase();
    return (
      m.name.toLowerCase().includes(q) ||
      (m.role || "").toLowerCase().includes(q) ||
      (m.email || "").toLowerCase().includes(q)
    );
  });

  const handleSelectMember = (member: TeamMember) => {
    const displayName = member.role
      ? `${member.name} — ${member.role}`
      : member.name;
    onChange({ attendees: displayName, teamMemberId: member.id });
    setIsOpen(false);
    setFilter("");
  };

  const handleClear = () => {
    onChange({ attendees: "", teamMemberId: null });
    setIsManual(false);
    setFilter("");
  };

  const handleSwitchToManual = () => {
    setIsManual(true);
    setIsOpen(false);
    onChange({ attendees: filter || attendees, teamMemberId: null });
    setFilter("");
  };

  // Manual text input mode
  if (useManual) {
    return (
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-sm-caps text-text-tertiary">
            Who is this with?
          </label>
          {!isGuest && members.length > 0 && (
            <button
              type="button"
              onClick={() => setIsManual(false)}
              className="text-[11px] text-brand-600 hover:text-brand-800 font-medium transition-colors"
            >
              Pick from team
            </button>
          )}
        </div>
        <input
          type="text"
          value={attendees}
          onChange={(e) => onChange({ attendees: e.target.value, teamMemberId: null })}
          placeholder="e.g., Sarah Chen — Senior Engineer"
          className="w-full px-4 py-2.5 rounded-lg border border-border bg-surface text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-brand-700 transition-all"
        />
      </div>
    );
  }

  // Team member picker mode
  return (
    <div ref={containerRef}>
      <div className="flex items-center justify-between mb-1.5">
        <label className="block text-sm-caps text-text-tertiary">
          Who is this with?
        </label>
        <button
          type="button"
          onClick={handleSwitchToManual}
          className="text-[11px] text-brand-600 hover:text-brand-800 font-medium transition-colors"
        >
          Enter manually
        </button>
      </div>

      {/* Selected member display or input */}
      {selectedMember && !isOpen ? (
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-brand-300 bg-brand-50/50">
          <div className="w-6 h-6 rounded-full bg-brand-100 border border-brand-200 flex items-center justify-center flex-shrink-0">
            <span className="text-[10px] font-bold text-brand-700">
              {selectedMember.name[0].toUpperCase()}
            </span>
          </div>
          <span className="text-sm font-medium text-text-primary flex-1 truncate">
            {selectedMember.name}
            {selectedMember.role && (
              <span className="text-text-tertiary font-normal"> — {selectedMember.role}</span>
            )}
          </span>
          <button
            type="button"
            onClick={handleClear}
            className="w-5 h-5 flex items-center justify-center rounded hover:bg-brand-200 text-text-tertiary hover:text-text-primary transition-colors flex-shrink-0"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ) : (
        <div className="relative">
          <input
            type="text"
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder="Search team members..."
            className="w-full px-4 py-2.5 rounded-lg border border-border bg-surface text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-brand-700 transition-all"
          />
          <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary pointer-events-none" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
          </svg>
        </div>
      )}

      {/* Dropdown */}
      {isOpen && (
        <div className="mt-1 py-1 rounded-lg border border-border bg-surface shadow-lg max-h-48 overflow-y-auto z-20 relative">
          {filteredMembers.map((member) => (
            <button
              key={member.id}
              type="button"
              onClick={() => handleSelectMember(member)}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-brand-50 transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-brand-50 border border-brand-200 flex items-center justify-center flex-shrink-0">
                <span className="text-[10px] font-bold text-brand-700">
                  {member.name[0].toUpperCase()}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-text-primary truncate">{member.name}</p>
                {member.role && (
                  <p className="text-[11px] text-text-tertiary truncate">{member.role}</p>
                )}
              </div>
            </button>
          ))}
          {filteredMembers.length === 0 && (
            <p className="px-3 py-2 text-xs text-text-tertiary">No matching team members</p>
          )}
          <div className="border-t border-border mt-1 pt-1">
            <button
              type="button"
              onClick={handleSwitchToManual}
              className="w-full px-3 py-2 text-left text-xs font-medium text-brand-600 hover:bg-brand-50 transition-colors"
            >
              Enter a name manually instead
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
