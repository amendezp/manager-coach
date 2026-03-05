"use client";

import { useState, useRef, useEffect } from "react";
import { SendIcon } from "./Icons";

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

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  }, [input]);

  const handleSubmit = () => {
    const trimmed = input.trim();
    if (!trimmed || disabled) return;
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

  return (
    <div className="border-t border-border bg-surface/80 backdrop-blur-lg px-4 py-3">
      <div className="max-w-3xl mx-auto">
        <div
          className={`
            relative rounded-xl border transition-all duration-200
            ${isFocused ? "border-brand-700 shadow-sm" : "border-border"}
          `}
        >
          <div className="flex items-end gap-2 bg-surface rounded-xl">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={placeholder || "Type your message..."}
              disabled={disabled}
              rows={1}
              className="flex-1 resize-none bg-transparent px-4 py-3.5 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none disabled:opacity-40"
            />
            <button
              onClick={handleSubmit}
              disabled={disabled || !input.trim()}
              className={`
                flex-shrink-0 p-2.5 mr-2 mb-2 rounded-lg text-white transition-all duration-200
                ${
                  input.trim() && !disabled
                    ? "gradient-brand hover:opacity-90 active:scale-[0.95]"
                    : "bg-brand-100 text-brand-300"
                }
                disabled:opacity-30
              `}
            >
              <SendIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="flex items-center justify-center gap-1.5 mt-2">
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
        </div>
      </div>
    </div>
  );
}
