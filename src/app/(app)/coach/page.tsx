"use client";

import { useState, useCallback, useEffect } from "react";
import { useSession } from "next-auth/react";
import type { WizardStep, WizardContext, CoachableTemplate, CalendarEvent, Message } from "@/lib/types";
import WizardHeader from "@/components/wizard/WizardHeader";
import WizardNav from "@/components/wizard/WizardNav";
import StepCalendar from "@/components/wizard/StepCalendar";
import StepTemplateContext from "@/components/wizard/StepTemplateContext";
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
  const { status } = useSession();
  const isGuest = status === "unauthenticated";

  const [currentStep, setCurrentStep] = useState<WizardStep>(1);
  const [context, setContext] = useState<WizardContext>(INITIAL_CONTEXT);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [feedbackRequested, setFeedbackRequested] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error" | "guest">("idle");

  // Navigation
  const goToStep = useCallback(
    (step: WizardStep) => {
      // If leaving rehearsal and chat exists, warn
      if (currentStep === 3 && chatMessages.length > 0 && step !== 4) {
        if (
          !window.confirm(
            "Going back will reset your rehearsal conversation. Continue?"
          )
        ) {
          return;
        }
        setChatMessages([]);
        setFeedbackRequested(false);
      }
      setCurrentStep(step);
    },
    [currentStep, chatMessages.length]
  );

  const goNext = useCallback(() => {
    const next = Math.min(currentStep + 1, 4) as WizardStep;
    goToStep(next);
  }, [currentStep, goToStep]);

  const goBack = useCallback(() => {
    const prev = Math.max(currentStep - 1, isGuest ? 2 : 1) as WizardStep;
    goToStep(prev);
  }, [currentStep, goToStep, isGuest]);

  // Skip rehearsal — jump from step 2 (Prepare) directly to step 4 (Prep Sheet)
  const skipToDebrief = useCallback(() => {
    goToStep(4);
  }, [goToStep]);

  // Header step click — navigate to any completed step
  const handleStepClick = useCallback(
    (step: WizardStep) => {
      goToStep(step);
    },
    [goToStep]
  );

  // Context updates
  const updateContext = useCallback((updates: Partial<WizardContext>) => {
    setContext((prev) => ({ ...prev, ...updates }));
  }, []);

  const selectTemplate = useCallback((template: CoachableTemplate) => {
    setContext((prev) => ({ ...prev, template }));
  }, []);

  // Calendar event selection — pre-populates context fields and auto-advances
  const handleSelectCalendarEvent = useCallback(
    (event: CalendarEvent) => {
      setContext((prev) => ({
        ...prev,
        calendarEvent: event,
        attendees: event.attendees.join(", "),
        dateTime: event.date,
        interactionNature: event.title,
      }));
      // Auto-advance to template+context step after short delay for visual feedback
      setTimeout(() => {
        setCurrentStep(2 as WizardStep);
      }, 300);
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
      if (isGuest) {
        setSaveStatus("guest");
        return;
      }
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
    [context, chatMessages, isGuest]
  );

  // Auto-skip calendar step for guests (no Google tokens)
  useEffect(() => {
    if (status !== "loading" && isGuest && currentStep === 1) {
      setCurrentStep(2 as WizardStep);
    }
  }, [status, isGuest, currentStep]);

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
        // Need a template selected (custom needs a description)
        if (context.template?.id === "custom") {
          return context.template.description.trim() !== "";
        }
        return context.template !== null;
      case 3:
        return feedbackRequested;
      case 4:
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
        return "Start Rehearsal";
      case 3:
        return "View Prep Sheet";
      default:
        return "Next";
    }
  })();

  // Nav visible for step 2 only (step 1 has inline CTAs, step 3 has chat, step 4 has inline actions)
  const showNav = currentStep === 2 || (currentStep === 3 && feedbackRequested);

  return (
    <div className="h-full flex flex-col bg-surface-secondary">
      <WizardHeader currentStep={currentStep} onStepClick={handleStepClick} isGuest={isGuest} />

      <div className={`flex-1 flex flex-col ${currentStep === 3 ? "overflow-hidden" : "overflow-y-auto"}`}>
        {currentStep === 1 && (
          <StepCalendar
            onSkip={goNext}
            onSelectEvent={handleSelectCalendarEvent}
          />
        )}

        {currentStep === 2 && (
          <StepTemplateContext
            context={context}
            onContextChange={updateContext}
            onTemplateSelect={selectTemplate}
          />
        )}

        {currentStep === 3 && (
          <StepRehearsal
            context={context}
            messages={chatMessages}
            onMessagesChange={setChatMessages}
            feedbackRequested={feedbackRequested}
            onRequestFeedback={handleRequestFeedback}
          />
        )}

        {currentStep === 4 && (
          <StepDebrief
            context={context}
            chatMessages={chatMessages}
            onSave={handleSaveSession}
            saveStatus={saveStatus}
            isGuest={isGuest}
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
          onSkip={undefined}
          showSkip={false}
          nextLabel={nextLabel}
          showSkipRehearsal={currentStep === 2}
          onSkipRehearsal={skipToDebrief}
        />
      )}
    </div>
  );
}
