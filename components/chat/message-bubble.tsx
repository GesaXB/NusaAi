"use client";

import {
  Children,
  isValidElement,
  useDeferredValue,
  type ReactNode,
  type ReactElement,
  useState,
} from "react";
import { Edit2, RefreshCw, Check, X, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { normalizeAssistantMarkdown } from "@/lib/normalize-assistant-markdown";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { motion } from "framer-motion";
import type { Message } from "@/types";
import { KatexHtml } from "@/components/chat/katex-math";
import "katex/dist/katex.min.css";

function childText(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(childText).join("");
  if (isValidElement(node)) return childText((node as ReactElement<{ children?: ReactNode }>).props.children);
  return "";
}

interface MessageBubbleProps {
  message: Message;
  isStreaming?: boolean;
  onEdit?: (id: string, content: string) => void;
  onRegenerate?: (id?: string) => void;
}

export function MessageBubble({ message, isStreaming, onEdit, onRegenerate }: MessageBubbleProps) {
  const isUser = message.role === "user";
  const assistantMd =
    !isUser && message.content ? normalizeAssistantMarkdown(message.content) : message.content;
  const deferredMd = useDeferredValue(assistantMd);
  const markdownForRender = isStreaming ? deferredMd : assistantMd;

  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(message.content);
  const [copied, setCopied] = useState(false);

  const layoutSpring = { type: "spring" as const, stiffness: 380, damping: 34, mass: 0.65 };

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEditSubmit = () => {
    if (editValue.trim() && editValue !== message.content) {
      onEdit?.(message.id, editValue);
    }
    setIsEditing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{
        duration: isStreaming ? 0.42 : 0.52,
        ease: [0.22, 1, 0.36, 1],
        layout: layoutSpring,
      }}
      layout
      className={cn(
        "flex gap-3 sm:gap-4 group w-full relative",
        isUser && "flex-row-reverse"
      )}
    >
      {/* Avatar */}
      <div className="flex-shrink-0 mt-1">
        {isUser ? (
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-[10px] font-bold text-zinc-400 uppercase tracking-tighter shadow-sm">
            ME
          </div>
        ) : (
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-white border border-zinc-100 flex items-center justify-center overflow-hidden shadow-sm ring-4 ring-zinc-50/50">
            <Image src="/logo.svg" alt="NusaAI" width={20} height={20} className="object-contain" />
          </div>
        )}
      </div>

      {/* Bubble Container */}
      <div className="flex flex-col gap-2 max-w-[85%] sm:max-w-[80%] relative">
        <div
          className={cn(
            "rounded-[24px] px-4 sm:px-6 py-3 sm:py-4 text-[15px] leading-relaxed relative w-full",
            !isUser && isStreaming && "transition-[box-shadow,min-height] duration-300 ease-out shadow-md shadow-zinc-200/40",
            !isUser && !isStreaming && "transition-all duration-300",
            isUser
              ? "bg-zinc-900 text-white rounded-tr-none shadow-lg shadow-zinc-200/50 font-medium"
              : "bg-white border border-zinc-100/80 text-zinc-700 rounded-tl-none shadow-sm hover:shadow-md hover:border-zinc-200/60"
          )}
        >
          {isUser ? (
            <div className="flex flex-col gap-1">
              {isEditing ? (
                <div className="flex flex-col gap-2 min-w-[200px] sm:min-w-[300px]">
                  <textarea
                    autoFocus
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="w-full bg-zinc-800 text-white rounded-2xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/50 resize-none min-h-[80px]"
                  />
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => { setIsEditing(false); setEditValue(message.content); }}
                      className="px-3 py-1.5 rounded-lg hover:bg-zinc-800 text-zinc-300 transition-colors text-xs font-bold"
                    >
                      Batal
                    </button>
                    <button 
                      onClick={handleEditSubmit}
                      className="px-4 py-1.5 rounded-lg bg-brand-red text-white hover:bg-brand-red-dark transition-colors text-xs font-bold"
                    >
                      Simpan
                    </button>
                  </div>
                </div>
              ) : (
                <p className="whitespace-pre-wrap">{message.content}</p>
              )}
            </div>
          ) : (
            <div
              className={cn(
                "prose-chat-light max-w-none rounded-lg",
                isStreaming && "prose-streaming-reveal"
              )}
            >
              <motion.div
                {...(isStreaming ? { layout: true as const } : {})}
                transition={{ layout: layoutSpring }}
                style={{ transformOrigin: "top center" }}
              >
              <ReactMarkdown
                remarkPlugins={[remarkMath, remarkGfm, remarkBreaks]}
                rehypePlugins={[[rehypeKatex, { throwOnError: false, strict: false }]]}
                components={{
                  p: ({ children }) => <p className="mb-6 last:mb-0 leading-relaxed text-zinc-700">{children}</p>,
                  ul: ({ children }) => <ul className="mb-6 space-y-3 list-disc pl-5 text-zinc-700">{children}</ul>,
                  ol: ({ children }) => <ol className="mb-6 space-y-3 list-decimal pl-5 text-zinc-700">{children}</ol>,
                  li: ({ children }) => <li className="pl-1 marker:text-brand-red marker:font-black">{children}</li>,
                  h1: ({ children }) => <h1 className="text-2xl font-extrabold mb-6 mt-10 first:mt-0 text-zinc-900 tracking-tight">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-xl font-bold mb-5 mt-8 first:mt-0 text-zinc-900 tracking-tight border-b border-zinc-100 pb-2">{children}</h2>,
                  h3: ({ children }) => (
                    <h3 className="text-lg font-bold mb-4 mt-6 first:mt-0 text-zinc-900 flex items-center gap-2">
                      <span className="w-1 h-6 bg-brand-red rounded-full" />
                      {children}
                    </h3>
                  ),
                  h4: ({ children }) => (
                    <h4 className="text-base font-bold mb-3 mt-5 first:mt-0 text-zinc-900 tracking-tight">
                      {children}
                    </h4>
                  ),
                  hr: () => <hr className="my-8 border-0 border-t border-zinc-200" />,
                  a: ({ href, children }) => (
                    <a
                      href={href}
                      className="font-medium text-brand-red underline decoration-brand-red/30 underline-offset-2 hover:decoration-brand-red"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {children}
                    </a>
                  ),
                  pre: ({ children }) => {
                    const childArr = Children.toArray(children);
                    const codeEl = childArr.find(
                      (c) => isValidElement(c) && (c as ReactElement<{ className?: string }>).type === "code"
                    ) as ReactElement<{ className?: string; children?: ReactNode }> | undefined;
                    const cls = typeof codeEl?.props?.className === "string" ? codeEl.props.className : "";
                    if ((cls.includes("language-math") || cls.includes("language-latex")) && codeEl) {
                      const tex = childText(codeEl.props.children);
                      return (
                        <div className="mb-6 overflow-x-auto rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-4">
                          <KatexHtml tex={tex} displayMode />
                        </div>
                      );
                    }
                    return (
                      <pre className="mb-6 overflow-x-auto rounded-xl border border-zinc-200 bg-zinc-950 p-4 text-[0.85em] leading-relaxed text-zinc-100">
                        {children}
                      </pre>
                    );
                  },
                  code: ({ className, children }) => {
                    const isBlock = typeof className === "string" && className.includes("language-");
                    if (isBlock) {
                      return <code className={className}>{children}</code>;
                    }
                    const raw = childText(children).trim();
                    if (raw.startsWith("$$") && raw.endsWith("$$") && raw.length > 4) {
                      const tex = raw.slice(2, -2).trim();
                      if (tex) {
                        return (
                          <span className="inline-block max-w-full align-middle [&_.katex-display]:my-1">
                            <KatexHtml tex={tex} displayMode />
                          </span>
                        );
                      }
                    }
                    if (raw.startsWith("$") && raw.endsWith("$") && raw.length > 2 && !raw.startsWith("$$")) {
                      const tex = raw.slice(1, -1).trim();
                      if (tex) {
                        return (
                          <KatexHtml
                            tex={tex}
                            className="mx-0.5 align-middle text-[0.95em]"
                          />
                        );
                      }
                    }
                    return (
                      <code className="bg-zinc-100 text-brand-red px-2 py-0.5 rounded-lg font-mono text-[0.85em] font-semibold border border-zinc-200">
                        {children}
                      </code>
                    );
                  },
                  strong: ({ children }) => <strong className="font-bold text-zinc-900">{children}</strong>,
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-brand-red bg-zinc-50 py-3 px-5 rounded-r-xl my-6 italic text-zinc-600">
                      {children}
                    </blockquote>
                  ),
                }}
              >
                {markdownForRender}
              </ReactMarkdown>
              </motion.div>
              {isStreaming && (
                <span className="cursor-smooth" />
              )}
              {!isUser && !isStreaming && (onRegenerate || true) && (
                <div className="flex items-center gap-2 mt-4 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity border-t border-zinc-50 pt-2">
                  <button
                    onClick={handleCopy}
                    className="p-1.5 rounded-md hover:bg-zinc-100 text-zinc-400 hover:text-zinc-600 transition-colors flex items-center gap-1.5 text-xs font-medium"
                    title="Salin teks"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? "Tersalin" : "Salin"}
                  </button>
                  {onRegenerate && (
                    <button
                      onClick={() => onRegenerate(message.id)}
                      className="p-1.5 rounded-md hover:bg-zinc-100 text-zinc-400 hover:text-zinc-600 transition-colors flex items-center gap-1.5 text-xs font-medium"
                      title="Ulangi response"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      Ulangi
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action button below bubble for user messages */}
        {isUser && onEdit && !isStreaming && !isEditing && (
          <div className="flex justify-end opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity mt-0.5 px-2">
            <button
              onClick={() => setIsEditing(true)}
              className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-400 hover:text-brand-red transition-all flex items-center gap-1.5 group/btn"
              title="Edit pesan"
            >
              <Edit2 className="w-3 h-3 group-hover/btn:scale-110 transition-transform" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Edit</span>
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export function TypingIndicator() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10, filter: "blur(5px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      className="flex gap-3 sm:gap-4"
    >
      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-white border border-zinc-100 flex items-center justify-center flex-shrink-0 shadow-sm ring-4 ring-zinc-50/50">
        <Image src="/logo.svg" alt="NusaAI" width={18} height={18} />
      </div>
      <div className="bg-white border border-zinc-100/80 rounded-[24px] rounded-tl-none px-4 sm:px-6 py-3 sm:py-4 shadow-sm flex items-center">
        <div className="flex gap-1.5 items-center">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ 
                y: [0, -5, 0],
                opacity: [0.3, 1, 0.3],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
              className="w-1.5 h-1.5 rounded-full bg-brand-red/60"
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export function MessageSkeleton() {
  return (
    <div className="flex gap-4 animate-pulse">
      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-zinc-100 flex-shrink-0" />
      <div className="flex flex-col gap-3 flex-1 max-w-md">
        <div className="bg-zinc-100 h-4 w-3/4 rounded-full" />
        <div className="bg-zinc-100 h-4 w-full rounded-full" />
        <div className="bg-zinc-100 h-4 w-1/2 rounded-full" />
      </div>
    </div>
  );
}
