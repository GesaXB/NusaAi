"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Paperclip, Mic, Square } from "lucide-react";
import { cn } from "@/lib/utils";

interface PromptInputProps {
  onSend: (content: string) => void;
  onStop?: () => void;
  isLoading?: boolean;
  placeholder?: string;
}

export function PromptInput({
  onSend,
  onStop,
  isLoading = false,
  placeholder = "Tanya NusaAI sesuatu...",
}: PromptInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed || isLoading) return;
    onSend(trimmed);
    setValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 160) + "px";
  }, [value]);

  const canSend = value.trim().length > 0 && !isLoading;

  return (
    <div className="relative rounded-[1.25rem] border border-zinc-200 bg-white focus-within:border-brand-red/30 focus-within:ring-4 focus-within:ring-brand-red/5 transition-all duration-300 shadow-lg shadow-zinc-200/40 overflow-hidden">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        rows={1}
        disabled={isLoading}
        className={cn(
          "w-full resize-none bg-transparent px-4 sm:px-5 pt-3.5 sm:pt-4 pb-12 sm:pb-14 text-[14px] sm:text-[15px] text-zinc-900 placeholder:text-zinc-400",
          "focus:outline-none leading-relaxed max-h-40 overflow-y-auto",
          "disabled:opacity-50 break-words"
        )}
        style={{ wordBreak: 'break-word' }}
      />

      {/* Toolbar */}
      <div className="absolute bottom-3 sm:bottom-3.5 left-3 sm:left-4 right-3 sm:right-4 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-1.5 pointer-events-auto">
          <button className="p-2 rounded-xl text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50 transition-all border border-transparent hover:border-zinc-100">
            <Paperclip className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-xl text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50 transition-all border border-transparent hover:border-zinc-100">
            <Mic className="w-4 h-4" />
          </button>
          <span className="ml-2 text-[10px] font-semibold text-zinc-300 uppercase tracking-wider hidden sm:block">
            Shift+Enter untuk baris baru
          </span>
        </div>

        <div className="pointer-events-auto">
          {isLoading ? (
            <button
              onClick={onStop}
              className="flex items-center justify-center w-9 h-9 rounded-xl bg-zinc-900 text-white shadow-md active:scale-95 transition-all hover:bg-red-600 group"
              title="Stop generating"
            >
              <Square className="w-3.5 h-3.5 fill-white group-hover:fill-white transition-all" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!canSend}
              className={cn(
                "flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-300",
                canSend
                  ? "bg-zinc-900 hover:bg-zinc-800 text-white shadow-md active:scale-95"
                  : "bg-zinc-50 text-zinc-300 cursor-not-allowed"
              )}
            >
              <Send className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
