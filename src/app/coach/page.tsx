"use client";

import { useState, useCallback, useEffect } from "react";
import type { WizardStep, WizardContext, CoachableTemplate, CalendarEvent, Message } from "@/lib/types";
import WizardHeader from "@/components/wizard/WizardHeader";
import WizardNav from "@/components/wizard/WizardNav";
import StepCalendar from "@/components/wizard/StepCalendar";
import StepTemplate from "@/components/wizard/StepTemplate";
import StepContext from "@/components/wizard/StepContext";
import StepLearning from "@/components/wizard/StepLearning";
import StepRehearsal from "@/components/wizard/StepRehearsal";
import StepDebrief from "@/components/wizard/StepDebrief";

const INITIAL_CONTEXT: WizardContext = {
  calendarEvent: null,
  template: null,
  interactionNature: "",
  attendees: "",
  desiredOutcome: "",
  dateTime: "",
  additionalContext: "",
};

export default function CoachPage() {
  const [currentStep, setCurrentStep] = useState<WizardStep>(1);
  const [context, setContext] = useState<WizardContext>(INITIAL_CONTEXT);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [feedbackRequested, setFeedbackRequested] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  // Navigation
  const goNext = useCallback(() => {
    setCurrentStep((s) => Math.min(s + 1, 6) as WizardStep);
  }, []);

  const goBack = useCallback(() => {
    if (currentStep === 5 && chatMessages.length > 0) {
      // Going back from rehearsal step — warn and reset
      if (
        window.confirm(
          "Going back will reset your rehearsal conversation. Continue?"
        )
      ) {
        setChatMessages([]);
        setFeedbackRequested(false);
        setCurrentStep((s) => (s - 1) as WizardStep);
      }
    } else {
      setCurrentStep((s) => Math.max(s - 1, 1) as WizardStep);
    }
  }, [currentStep, chatMessages.length]);

  // Context updates
  const updateContext = useCallback((updates: Partial<WizardContext>) => {
    setContext((prev) => ({ ...prev, ...updates }));
  }, []);

  const selectTemplate = useCallback((template: CoachableTemplate) => {
    setContext((prev) => ({ ...prev, template }));
  }, []);

  // Calendar event selection — pre-populates context fields
  const handleSelectCalendarEvent = useCallback(
    (event: CalendarEvent) => {
      setContext((prev) => ({
        ...prev,
        calendarEvent: event,
        attendees: event.attendees.join(", "),
        dateTime: event.date,
        interactionNature: event.title,
      }));
    },
    []
  );

  // Feedback request — StepRehearsal handles the actual send via onSendReady
  const handleRequestFeedback = useCallback(() => {
    setFeedbackRequested(true);
  }, []);

  // Auto-save session after debrief generation
  const handleSaveSession = useCallback(
    async (debriefContent: string) => {
      setSaveStatus("saving");
      try {
        const res = await fetch("/api/sessions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            templateId: context.template?.id,
            templateTitle: context.template?.title,
            context,
            chatMessages,
            debriefContent,
          }),
        });
        if (res.ok) {
          setSaveStatus("saved");
        } else {
          setSaveStatus("error");
        }
      } catch {
        setSaveStatus("error");
      }
    },
    [context, chatMessages]
  );

  // Check for pre-selected calendar event from landing page
  useEffect(() => {
    const stored = sessionStorage.getItem("selectedCalendarEvent");
    if (stored) {
      sessionStorage.removeItem("selectedCalendarEvent");
      try {
        const event = JSON.parse(stored) as CalendarEvent;
        handleSelectCalendarEvent(event);
        setCurrentStep(2 as WizardStep);
      } catch {
        // Ignore invalid data
      }
    }
  }, [handleSelectCalendarEvent]);

  // Determine if user can advance
  const canAdvance = (() => {
    switch (currentStep) {
      case 1:
        return true; // calendar is optional
      case 2:
        // Custom templates need a description to advance
        if (context.template?.id === "custom") {
          return context.template.description.trim() !== "";
        }
        return context.template !== null;
      case 3:
        return context.attendees.trim() !== "";
      case 4:
        return true; // learning is read-only
      case 5:
        return feedbackRequested;
      case 6:
        return false; // last step
      default:
        return false;
    }
  })();

  // Step-specific nav labels
  const nextLabel = (() => {
    switch (currentStep) {
      case 1:
        return "Next";
      case 2:
        return "Next";
      case 3:
        return "Next";
      case 4:
        return "Start Rehearsal";
      case 5:
        return "View Prep Sheet";
      default:
        return "Next";
    }
  })();

  // Steps 5 (rehearsal) and 6 (debrief) don't show the standard nav
  const showNav = currentStep <= 4 || (currentStep === 5 && feedbackRequested);

  return (
    <div className="h-dvh flex flex-col bg-surface-secondary">
      <WizardHeader currentStep={currentStep} />

      <div className={`flex-1 flex flex-col ${currentStep === 5 ? "overflow-hidden" : "overflow-y-auto"}`}>
        {currentStep === 1 && (
          <StepCalendar
            onSkip={goNext}
            onSelectEvent={handleSelectCalendarEvent}
          />
        )}

        {currentStep === 2 && (
          <StepTemplate
            selected={context.template}
            onSelect={selectTemplate}
          />
        )}

        {currentStep === 3 && (
          <StepContext context={context} onChange={updateContext} />
        )}

        {currentStep === 4 && context.template && (
          <StepLearning template={context.template} />
        )}

        {currentStep === 5 && (
          <StepRehearsal
            context={context}
            messages={chatMessages}
            onMessagesChange={setChatMessages}
            feedbackRequested={feedbackRequested}
            onRequestFeedback={handleRequestFeedback}
          />
        )}

        {currentStep === 6 && (
          <StepDebrief
            context={context}
            chatMessages={chatMessages}
            onSave={handleSaveSession}
            saveStatus={saveStatus}
          />
        )}
      </div>

      {/* Navigation — hidden during rehearsal (chat has its own input) and debrief */}
      {showNav && (
        <WizardNav
          currentStep={currentStep}
          canAdvance={canAdvance}
          onBack={goBack}
          onNext={goNext}
          onSkip={currentStep === 1 ? goNext : undefined}
          showSkip={currentStep === 1}
          nextLabel={nextLabel}
        />
      )}
    </div>
  );
}
