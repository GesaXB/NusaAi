/**
 * Buffers incomplete SSE lines across binary chunks (OpenRouter / OpenAI style `data: {...}`).
 */
export function createSseDeltaParser() {
  let lineBuf = "";

  const parseDataLine = (data: string): string => {
    if (data === "[DONE]" || !data) return "";
    try {
      const parsed = JSON.parse(data) as {
        choices?: Array<{ delta?: { content?: string } }>;
      };
      return parsed.choices?.[0]?.delta?.content ?? "";
    } catch {
      return "";
    }
  };

  return {
    push(chunk: string): string[] {
      lineBuf += chunk;
      const parts = lineBuf.split("\n");
      lineBuf = parts.pop() ?? "";
      const deltas: string[] = [];
      for (const line of parts) {
        if (!line.startsWith("data: ")) continue;
        const data = line.slice(6).trim();
        const d = parseDataLine(data);
        if (d) deltas.push(d);
      }
      return deltas;
    },
    /** Call after the reader finishes to flush a trailing `data:` line without newline. */
    end(): string[] {
      const trimmed = lineBuf.trim();
      lineBuf = "";
      if (!trimmed.startsWith("data:")) return [];
      const data = trimmed.startsWith("data: ") ? trimmed.slice(6).trim() : trimmed.slice(5).trim();
      const d = parseDataLine(data);
      return d ? [d] : [];
    },
  };
}
