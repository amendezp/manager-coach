"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { SendIcon } from "./Icons";
import MicButton from "./MicButton";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";

export default function ChatInput({
  onSend,
  disabled,
  placeholder,
}: {
  onSend: (message: string) => void;
  disabled: boolean;
  placeholder?: string;
}) {
  const [input, setInput] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Speech recognition — appends transcribed text to input
  const handleTranscript = useCallback((text: string) => {
    setInput((prev) => {
      // If there's existing text, add a space before the new transcript
      const separator = prev.trim() ? " " : "";
      return prev.trim() + separator + text;
    });
  }, []);

  const {
    isSupported,
    isListening,
    interimTranscript,
    toggleListening,
    resetTranscript,
  } = useSpeechRecognition({
    onTranscript: handleTranscript,
  });

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  }, [input, interimTranscript]);

  const handleSubmit = () => {
    const trimmed = input.trim();
    if (!trimmed || disabled) return;
    // Stop listening if active
    if (isListening) {
      toggleListening();
      resetTranscript();
    }
    onSend(trimmed);
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Display value: input + interim transcript preview
  const displayValue = isListening && interimTranscript
    ? input + (input.trim() ? " " : "") + interimTranscript
    : input;

  const hasContent = input.trim() || (isListening && interimTranscript.trim());

  return (
    <div className="border-t border-border bg-surface/80 backdrop-blur-lg px-4 py-3">
      <div className="max-w-3xl mx-auto">
        <div
          className={`
            relative rounded-xl border transition-all duration-200
            ${isListening ? "border-red-300 shadow-sm" : isFocused ? "border-brand-700 shadow-sm" : "border-border"}
          `}
        >
          <div className="flex items-end gap-1 bg-surface rounded-xl">
            <textarea
              ref={textareaRef}
              value={displayValue}
              onChange={(e) => {
                // Only allow manual edits when not showing interim results
                if (!isListening || !interimTranscript) {
                  setInput(e.target.value);
                }
              }}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={
                isListening
                  ? "Listening..."
                  : placeholder || "Type or speak your message..."
              }
              disabled={disabled}
              rows={1}
              className={`flex-1 resize-none bg-transparent px-4 py-3.5 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none disabled:opacity-40 ${
                isListening && interimTranscript ? "text-text-secondary" : ""
              }`}
            />

            {/* Mic button */}
            <MicButton
              isListening={isListening}
              isSupported={isSupported}
              onClick={toggleListening}
              variant="compact"
              className="mb-2"
            />

            {/* Send button */}
            <button
              onClick={handleSubmit}
              disabled={disabled || !hasContent}
              className={`
                flex-shrink-0 p-2.5 mr-2 mb-2 rounded-lg text-white transition-all duration-200
                ${
                  hasContent && !disabled
                    ? "gradient-user hover:opacity-90 active:scale-[0.95]"
                    : "bg-brand-100 text-brand-300"
                }
                disabled:opacity-30
              `}
            >
              <SendIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Status line */}
        <div className="flex items-center justify-center gap-1.5 mt-2">
          {isListening ? (
            <>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
              </span>
              <p className="text-[11px] text-red-500 font-medium">
                Recording — speak naturally, then tap stop
              </p>
            </>
          ) : (
            <>
              <svg
                className="w-3 h-3 text-text-tertiary/50"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                />
              </svg>
              <p className="text-[11px] text-text-tertiary/50">
                Private &amp; confidential
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
