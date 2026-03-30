"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import type { TeamMember } from "@/lib/types";
import { getRelativeTime } from "@/lib/utils";

interface TeamMemberWithSessions extends TeamMember {
  sessions?: {
    id: string;
    templateTitle: string | null;
    context: Record<string, unknown> | null;
    createdAt: string;
  }[];
}

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [expandedData, setExpandedData] = useState<TeamMemberWithSessions | null>(null);
  const [expandedLoading, setExpandedLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formRole, setFormRole] = useState("");
  const [formNotes, setFormNotes] = useState("");

  const fetchMembers = useCallback(async () => {
    try {
      const res = await fetch("/api/team-members");
      if (res.ok) {
        setMembers(await res.json());
      }
    } catch {
      console.error("Failed to fetch team members");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const resetForm = () => {
    setFormName("");
    setFormEmail("");
    setFormRole("");
    setFormNotes("");
    setShowForm(false);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;
    setSaving(true);

    try {
      const body = { name: formName, email: formEmail, role: formRole, notes: formNotes };

      if (editingId) {
        const res = await fetch(`/api/team-members/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (res.ok) {
          await fetchMembers();
          resetForm();
        }
      } else {
        const res = await fetch("/api/team-members", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (res.ok) {
          await fetchMembers();
          resetForm();
        }
      }
    } catch {
      console.error("Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (member: TeamMember) => {
    setEditingId(member.id);
    setFormName(member.name);
    setFormEmail(member.email || "");
    setFormRole(member.role || "");
    setFormNotes(member.notes || "");
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Remove this team member? Their coaching sessions will be preserved.")) {
      return;
    }
    setDeletingId(id);
    try {
      const res = await fetch(`/api/team-members/${id}`, { method: "DELETE" });
      if (res.ok) {
        setMembers((prev) => prev.filter((m) => m.id !== id));
        if (expandedId === id) {
          setExpandedId(null);
          setExpandedData(null);
        }
      }
    } catch {
      console.error("Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  const handleExpand = async (id: string) => {
    if (expandedId === id) {
      setExpandedId(null);
      setExpandedData(null);
      return;
    }
    setExpandedId(id);
    setExpandedLoading(true);
    try {
      const res = await fetch(`/api/team-members/${id}`);
      if (res.ok) {
        setExpandedData(await res.json());
      }
    } catch {
      console.error("Failed to fetch member details");
    } finally {
      setExpandedLoading(false);
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-surface-secondary">
      <div className="max-w-2xl mx-auto px-4 pt-8 pb-12 sm:pt-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-fade-up">
          <div>
            <h2
              className="text-xl sm:text-2xl font-bold text-text-primary mb-2"
              style={{ letterSpacing: "-0.02em" }}
            >
              My Team
            </h2>
            <p className="text-text-secondary text-sm leading-relaxed max-w-lg">
              Add your direct reports to track coaching sessions per person and
              get history-aware AI coaching.
            </p>
          </div>
          {!showForm && (
            <button
              onClick={() => { resetForm(); setShowForm(true); }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg gradient-brand text-white text-sm font-semibold hover:opacity-90 active:scale-[0.98] transition-all duration-200"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Add Member
            </button>
          )}
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="mb-6 p-5 rounded-xl border border-border bg-surface animate-fade-up-sm"
          >
            <p className="text-sm font-semibold text-text-primary mb-4">
              {editingId ? "Edit Team Member" : "Add Team Member"}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-sm-caps text-text-tertiary mb-1">Name *</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g., Sarah Chen"
                  className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-brand-700 transition-all"
                  required
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm-caps text-text-tertiary mb-1">Email</label>
                <input
                  type="email"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="sarah@company.com"
                  className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-brand-700 transition-all"
                />
              </div>
            </div>
            <div className="mb-3">
              <label className="block text-sm-caps text-text-tertiary mb-1">Role / Title</label>
              <input
                type="text"
                value={formRole}
                onChange={(e) => setFormRole(e.target.value)}
                placeholder="e.g., Senior Engineer"
                className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-brand-700 transition-all"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm-caps text-text-tertiary mb-1">Notes</label>
              <textarea
                value={formNotes}
                onChange={(e) => setFormNotes(e.target.value)}
                placeholder="e.g., Working toward promotion, strong communicator, needs help with delegation..."
                rows={2}
                className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-brand-700 transition-all resize-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                type="submit"
                disabled={saving || !formName.trim()}
                className="px-4 py-2 rounded-lg gradient-brand text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition-all"
              >
                {saving ? "Saving..." : editingId ? "Save Changes" : "Add Member"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 rounded-lg text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Member list */}
        <div className="animate-fade-up" style={{ animationDelay: "0.1s" }}>
          <p className="text-sm-caps text-text-tertiary mb-3">
            Team Members{members.length > 0 ? ` (${members.length})` : ""}
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

          {!loading && members.length === 0 && (
            <div className="text-center py-10 px-4 rounded-xl border border-border bg-surface">
              <svg className="w-8 h-8 text-text-tertiary mx-auto mb-3 opacity-50" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
              </svg>
              <p className="text-sm text-text-tertiary">No team members yet.</p>
              <p className="text-xs text-text-tertiary mt-1">
                Add your direct reports to start tracking coaching sessions.
              </p>
            </div>
          )}

          {!loading && members.length > 0 && (
            <div className="space-y-2">
              {members.map((member) => (
                <div key={member.id}>
                  <div
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg border bg-surface transition-all cursor-pointer hover:bg-brand-50/50 ${
                      expandedId === member.id ? "border-brand-300 bg-brand-50/30" : "border-border"
                    }`}
                    onClick={() => handleExpand(member.id)}
                  >
                    {/* Avatar */}
                    <div className="flex-shrink-0 w-9 h-9 rounded-full bg-brand-50 border border-brand-200 flex items-center justify-center">
                      <span className="text-xs font-bold text-brand-700">
                        {member.name[0].toUpperCase()}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-primary truncate">
                        {member.name}
                      </p>
                      <p className="text-[11px] text-text-tertiary truncate">
                        {[member.role, member.email].filter(Boolean).join(" · ") || "No details"}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleEdit(member)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-brand-100 text-text-tertiary hover:text-text-primary transition-colors"
                        title="Edit"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(member.id)}
                        disabled={deletingId === member.id}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-text-tertiary hover:text-red-500 transition-colors disabled:opacity-50"
                        title="Remove"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                      </button>
                    </div>

                    {/* Expand chevron */}
                    <svg
                      className={`w-4 h-4 text-text-tertiary transition-transform duration-200 ${expandedId === member.id ? "rotate-180" : ""}`}
                      fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                  </div>

                  {/* Expanded detail */}
                  {expandedId === member.id && (
                    <div className="mt-1 ml-12 mr-4 p-4 rounded-lg border border-border bg-surface animate-fade-up-sm">
                      {member.notes && (
                        <div className="mb-4">
                          <p className="text-sm-caps text-text-tertiary mb-1">Notes</p>
                          <p className="text-sm text-text-secondary">{member.notes}</p>
                        </div>
                      )}

                      <p className="text-sm-caps text-text-tertiary mb-2">Coaching Sessions</p>
                      {expandedLoading && (
                        <div className="flex items-center gap-2 py-3">
                          <div className="thinking-dots flex items-center gap-0.5"><span /><span /><span /></div>
                        </div>
                      )}
                      {!expandedLoading && expandedData?.sessions?.length === 0 && (
                        <p className="text-xs text-text-tertiary py-2">No sessions yet with {member.name}.</p>
                      )}
                      {!expandedLoading && expandedData?.sessions && expandedData.sessions.length > 0 && (
                        <div className="space-y-1.5">
                          {expandedData.sessions.map((s) => (
                            <Link
                              key={s.id}
                              href={`/dashboard/${s.id}`}
                              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border/70 hover:bg-brand-50 hover:border-brand-300 transition-all"
                            >
                              <div className="w-1.5 h-1.5 rounded-full bg-brand-400 flex-shrink-0" />
                              <span className="text-sm text-text-primary truncate flex-1">
                                {s.templateTitle || "Coaching Session"}
                              </span>
                              <span className="text-[11px] text-text-tertiary flex-shrink-0">
                                {getRelativeTime(s.createdAt)}
                              </span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info note */}
        {members.length > 0 && (
          <div
            className="mt-8 px-4 py-3 rounded-lg bg-brand-50 border border-brand-200 animate-fade-up"
            style={{ animationDelay: "0.3s" }}
          >
            <p className="text-xs text-text-secondary leading-relaxed">
              <strong className="text-text-primary">How it works:</strong> When
              you select a team member during coaching setup, the AI will review
              your past sessions with that person and provide continuity-aware
              coaching and suggestions.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
