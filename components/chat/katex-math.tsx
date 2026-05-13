"use client";

import { useMemo } from "react";
import katex from "katex";
import { cn } from "@/lib/utils";

export function KatexHtml({
  tex,
  displayMode,
  className,
}: {
  tex: string;
  displayMode?: boolean;
  className?: string;
}) {
  const html = useMemo(() => {
    const trimmed = tex.trim();
    if (!trimmed) return "";
    try {
      return katex.renderToString(trimmed, {
        displayMode: Boolean(displayMode),
        throwOnError: false,
        strict: false,
      });
    } catch {
      return "";
    }
  }, [tex, displayMode]);

  if (!html) {
    return <span className="text-zinc-400 text-sm">{tex}</span>;
  }

  const common = cn(
    "[&_.katex]:text-zinc-900",
    displayMode && "overflow-x-auto py-1 my-2",
    className
  );

  if (displayMode) {
    return (
      <div
        className={common}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return (
    <span
      className={common}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
