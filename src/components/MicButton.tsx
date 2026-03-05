"use client";

import { MicrophoneIcon, StopCircleIcon } from "./Icons";

interface MicButtonProps {
  isListening: boolean;
  isSupported: boolean;
  onClick: () => void;
  /** Compact variant for inline use (e.g., inside textareas) */
  variant?: "default" | "compact";
  className?: string;
}

export default function MicButton({
  isListening,
  isSupported,
  onClick,
  variant = "default",
  className = "",
}: MicButtonProps) {
  if (!isSupported) return null;

  const isCompact = variant === "compact";

  return (
    <button
      type="button"
      onClick={onClick}
      title={isListening ? "Stop recording" : "Start voice input"}
      className={`
        relative flex items-center justify-center transition-all duration-200
        ${isCompact ? "p-1.5 rounded-lg" : "p-2.5 rounded-lg"}
        ${
          isListening
            ? "text-red-500 hover:text-red-600 bg-red-50"
            : "text-green-600 hover:text-green-700 bg-green-50 hover:bg-green-100"
        }
        ${className}
      `}
    >
      {/* Pulsing ring when recording */}
      {isListening && (
        <span className="absolute inset-0 rounded-lg animate-pulse-ring" />
      )}

      {isListening ? (
        <StopCircleIcon className={isCompact ? "w-4 h-4" : "w-4 h-4"} />
      ) : (
        <MicrophoneIcon className={isCompact ? "w-4 h-4" : "w-4 h-4"} />
      )}
    </button>
  );
}
