"use client";

import { useState } from "react";
import { AI_MODELS, type AIModel } from "@/types";
import { ChevronDown, Check, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModelSelectorProps {
  value: string;
  onChange: (modelId: string) => void;
}

export function ModelSelector({ value, onChange }: ModelSelectorProps) {
  const [open, setOpen] = useState(false);
  const selected = AI_MODELS.find((m) => m.id === value) ?? AI_MODELS[0];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-zinc-200 bg-white text-sm text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50 transition-all"
      >
        <Zap className="w-3.5 h-3.5 text-brand-red" />
        <span className="font-medium">{selected.name}</span>
        <ChevronDown className={cn("w-3.5 h-3.5 text-zinc-400 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute top-full right-0 mt-2 z-20 w-72 rounded-xl border border-zinc-100 bg-white shadow-xl overflow-hidden">
            {AI_MODELS.map((model) => (
              <button
                key={model.id}
                onClick={() => { onChange(model.id); setOpen(false); }}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-zinc-50 transition-colors",
                  value === model.id && "bg-brand-red/5"
                )}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-zinc-900">{model.name}</p>
                    <span className="text-xs text-zinc-400">{model.provider}</span>
                  </div>
                  <p className="text-xs text-zinc-500 mt-0.5">{model.description}</p>
                </div>
                {value === model.id && (
                  <Check className="w-4 h-4 text-brand-red flex-shrink-0" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
