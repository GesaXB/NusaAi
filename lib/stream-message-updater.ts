import type { Dispatch, SetStateAction } from "react";

/**
 * Batches assistant markdown updates to one paint per animation frame
 * so ReactMarkdown + KaTeX re-render less jarringly during SSE.
 */
export function createStreamMessageUpdater<T extends { id: string; content: string }>(
  setMessages: Dispatch<SetStateAction<T[]>>,
  assistantId: string
) {
  let buf = "";
  let outerRaf: number | null = null;
  let innerRaf: number | null = null;

  const paint = () => {
    outerRaf = null;
    innerRaf = null;
    setMessages((prev) =>
      prev.map((m) => (m.id === assistantId ? { ...m, content: buf } : m))
    );
  };

  const schedule = () => {
    if (outerRaf != null || innerRaf != null) return;
    outerRaf = requestAnimationFrame(() => {
      outerRaf = null;
      innerRaf = requestAnimationFrame(() => {
        innerRaf = null;
        paint();
      });
    });
  };

  return {
    pushDelta(delta: string) {
      if (!delta) return;
      buf += delta;
      schedule();
    },
    /** Cancel pending rAF and apply latest buffer (call when stream ends). */
    finish() {
      if (outerRaf != null) {
        cancelAnimationFrame(outerRaf);
        outerRaf = null;
      }
      if (innerRaf != null) {
        cancelAnimationFrame(innerRaf);
        innerRaf = null;
      }
      paint();
    },
    getBuffer() {
      return buf;
    },
  };
}
