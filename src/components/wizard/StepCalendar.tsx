"use client";

import { useState, useEffect } from "react";
import { CalendarIcon } from "../Icons";
import type { CalendarEvent } from "@/lib/types";

interface CalendarApiEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  attendees: string[];
}

function formatEventTime(isoString: string) {
  const date = new Date(isoString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const isToday = date.toDateString() === today.toDateString();
  const isTomorrow = date.toDateString() === tomorrow.toDateString();

  const timeStr = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  if (isToday) return `Today at ${timeStr}`;
  if (isTomorrow) return `Tomorrow at ${timeStr}`;

  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatDate(isoString: string) {
  const date = new Date(isoString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(isoString: string) {
  const date = new Date(isoString);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function StepCalendar({
  onSkip,
  onSelectEvent,
}: {
  onSkip: () => void;
  onSelectEvent?: (event: CalendarEvent) => void;
}) {
  const [events, setEvents] = useState<CalendarApiEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch("/api/calendar");
        if (res.ok) {
          const data = await res.json();
          setEvents(data.events || []);
          if (data.error) {
            setError(data.error);
          }
        } else {
          setError("Failed to fetch calendar");
        }
      } catch {
        setError("fetch_failed");
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  const handleSelectEvent = (event: CalendarApiEvent) => {
    setSelectedId(event.id);
    const calendarEvent: CalendarEvent = {
      id: event.id,
      title: event.title,
      date: formatDate(event.start),
      time: formatTime(event.start),
      attendees: event.attendees,
    };
    onSelectEvent?.(calendarEvent);
  };

  const hasEvents = events.length > 0;

  return (
    <div className="max-w-2xl mx-auto px-4 pt-8 pb-6 sm:pt-14 sm:pb-8">
      <div className="text-center mb-10 animate-fade-up">
        <div className="relative inline-flex items-center justify-center mb-6">
          <div className="absolute inset-0 w-16 h-16 rounded-2xl bg-brand-200/40 blur-xl" />
          <div className="relative w-14 h-14 rounded-2xl gradient-brand flex items-center justify-center shadow-lg shadow-brand-500/20">
            <CalendarIcon className="w-7 h-7 text-white" />
          </div>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary mb-3">
          {hasEvents ? "Select a Meeting" : "Connect Your Calendar"}
        </h2>
        <p className="text-text-secondary text-sm sm:text-base leading-relaxed max-w-lg mx-auto">
          {hasEvents
            ? "Choose an upcoming meeting to prepare for, or skip to enter details manually."
            : "Your calendar events will appear here to help auto-fill meeting details — or skip to enter them manually."}
        </p>
      </div>

      <div
        className="max-w-md mx-auto space-y-3 animate-fade-up"
        style={{ animationDelay: "0.1s" }}
      >
        {/* Loading state */}
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="thinking-dots flex items-center gap-0.5">
              <span />
              <span />
              <span />
            </div>
          </div>
        )}

        {/* Events list */}
        {!loading && hasEvents && (
          <div className="space-y-2">
            {events.map((event, i) => {
              const isSelected = selectedId === event.id;
              return (
                <button
                  key={event.id}
                  onClick={() => handleSelectEvent(event)}
                  className={`
                    w-full flex items-start gap-3.5 p-4 rounded-xl border text-left
                    transition-all duration-200 ease-out
                    animate-fade-up-sm stagger-${Math.min(i + 1, 6)}
                    ${
                      isSelected
                        ? "border-brand-400 bg-brand-50 shadow-md shadow-brand-100/50"
                        : "border-border/80 bg-surface hover:border-brand-200 hover:shadow-md hover:shadow-brand-100/50 hover:-translate-y-0.5"
                    }
                    active:translate-y-0 active:shadow-sm
                  `}
                >
                  {/* Selection indicator */}
                  {isSelected && (
                    <div className="absolute top-3 right-3 w-5 h-5 rounded-full gradient-brand flex items-center justify-center">
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={3}
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m4.5 12.75 6 6 9-13.5"
                        />
                      </svg>
                    </div>
                  )}

                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-xl border flex items-center justify-center transition-colors ${
                      isSelected
                        ? "bg-brand-100 border-brand-200"
                        : "bg-brand-50 border-brand-100/80"
                    }`}
                  >
                    <CalendarIcon
                      className={`w-5 h-5 ${isSelected ? "text-brand-700" : "text-brand-600"}`}
                    />
                  </div>

                  <div className="min-w-0 flex-1 relative">
                    <p
                      className={`text-sm font-semibold truncate pr-6 ${
                        isSelected ? "text-brand-700" : "text-text-primary"
                      }`}
                    >
                      {event.title}
                    </p>
                    <p className="text-xs text-text-tertiary mt-0.5">
                      {formatEventTime(event.start)}
                    </p>
                    {event.attendees.length > 0 && (
                      <p className="text-xs text-text-tertiary mt-0.5 truncate">
                        with {event.attendees.slice(0, 3).join(", ")}
                        {event.attendees.length > 3 &&
                          ` +${event.attendees.length - 3} more`}
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* No events / error state */}
        {!loading && !hasEvents && (
          <div className="text-center py-6 px-4 rounded-2xl border border-dashed border-border bg-surface/50">
            <CalendarIcon className="w-8 h-8 text-text-tertiary mx-auto mb-3 opacity-50" />
            <p className="text-sm text-text-secondary mb-1">
              {error === "calendar_api_error"
                ? "Could not access your calendar"
                : "No upcoming events found"}
            </p>
            <p className="text-xs text-text-tertiary">
              {error === "calendar_api_error"
                ? "Calendar permissions may need to be granted again."
                : "You can enter meeting details manually in the next step."}
            </p>
          </div>
        )}

        {/* Skip CTA */}
        <button
          onClick={onSkip}
          className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl border border-brand-200 bg-brand-50 hover:bg-brand-100 transition-colors duration-200 group"
        >
          <span className="text-sm font-semibold text-brand-700 group-hover:text-brand-800">
            {hasEvents
              ? "Skip — I\u2019ll enter details manually"
              : "Continue — I\u2019ll enter details manually"}
          </span>
          <svg
            className="w-4 h-4 text-brand-500 group-hover:translate-x-0.5 transition-transform"
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
        </button>
      </div>

      <div
        className="text-center mt-8 animate-fade-in"
        style={{ animationDelay: "0.3s" }}
      >
        <p className="text-xs text-text-tertiary">
          Calendar data is only used to pre-fill your meeting context — we
          never modify your calendar.
        </p>
      </div>
    </div>
  );
}
