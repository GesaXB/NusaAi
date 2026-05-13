/**
 * Normalizes common LLM habits (bold-only section titles, bullet glyphs)
 * so ReactMarkdown renders clear hierarchy like a textbook layout.
 */
export function normalizeAssistantMarkdown(raw: string): string {
  if (!raw || typeof raw !== "string") return raw;

  const lines = raw.split("\n");
  const out: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i] ?? "";
    const trimmed = line.trim();

    const bullet = trimmed.match(/^(\s*)[•·▪▸]\s+(.*)$/);
    if (bullet) {
      line = `${bullet[1]}- ${bullet[2]}`;
    }

    const fullBold = trimmed.match(/^\*\*(.+)\*\*$/);
    if (fullBold) {
      const inner = fullBold[1].trim();
      const looksLikeSentence =
        inner.length > 90 || /\.\s+[A-Za-zÀ-ÿ]/.test(inner) || inner.includes("**");
      if (!looksLikeSentence && inner.length > 0) {
        const prev = out[out.length - 1];
        if (prev !== undefined && prev.trim() !== "") {
          out.push("");
        }
        line = `### ${inner}`;
      }
    }

    out.push(line);
  }

  let joined = out.join("\n");
  joined = joined.replace(/^(#{1,6}\s+[^\n]+)\n(?!\n)/gm, "$1\n\n");
  joined = joined.replace(/([^\n])\n([-*]\s)/g, "$1\n\n$2");
  // LLMs often wrap LaTeX in backticks → GFM parses as <code>; unwrap so remark-math + KaTeX run.
  joined = joined.replace(/`(\$\$[\s\S]*?\$\$)`/g, "$1");
  joined = joined.replace(/`(\$[^`]*\$)`/g, "$1");
  return joined;
}
