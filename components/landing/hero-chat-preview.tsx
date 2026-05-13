"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Send, Square } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { generateId } from "@/lib/utils";
import { createSseDeltaParser } from "@/lib/sse-delta-parser";
import { createStreamMessageUpdater } from "@/lib/stream-message-updater";
import Link from "next/link";
import { MessageBubble } from "@/components/chat/message-bubble";
import { SYSTEM_PROMPT } from "@/types";

interface PreviewMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const QUICK_PROMPTS = [
  "Jelaskan konsep limit dalam kalkulus",
  "Apa itu fotosintesis?",
  "Rumus volume bola",
];

export function HeroChatPreview() {
  const [messages, setMessages] = useState<PreviewMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (messages.length > 0 || isLoading) {
      requestAnimationFrame(() => {
        const el = scrollRef.current;
        if (el) {
          el.scrollTo({
            top: el.scrollHeight,
            behavior: isLoading ? "auto" : "smooth",
          });
        }
      });
    }
  }, [messages, isLoading]);

  const stop = () => {
    abortRef.current?.abort();
    setIsLoading(false);
  };

  const send = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || isLoading) return;
    setInput("");

    abortRef.current?.abort();
    abortRef.current = new AbortController();

    const userMsg: PreviewMessage = { id: generateId(), role: "user", content };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: abortRef.current.signal,
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          modelId: "meta-llama/llama-3.1-8b-instruct",
          systemPrompt: SYSTEM_PROMPT,
        }),
      });

      if (!response.ok || !response.body) throw new Error();

      const id = generateId();
      setMessages(prev => [...prev, { id, role: "assistant", content: "" }]);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      const sse = createSseDeltaParser();
      const stream = createStreamMessageUpdater(setMessages, id);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        for (const d of sse.push(chunk)) {
          stream.pushDelta(d);
        }
      }
      for (const d of sse.end()) {
        stream.pushDelta(d);
      }
      stream.finish();
    } catch (err: any) {
      if (err?.name === "AbortError") return;
      setMessages(prev => [...prev, { id: generateId(), role: "assistant", content: "Koneksi gagal. Coba lagi." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-3xl border border-zinc-100 shadow-2xl shadow-zinc-200/50 overflow-hidden flex flex-col min-h-0" style={{ height: "440px" }}>
      {/* Chat header */}
      <div className="flex items-center gap-3 px-5 py-3.5 border-b border-zinc-50 bg-zinc-50/50 flex-shrink-0">
        <div className="w-8 h-8 rounded-xl bg-white border border-zinc-100 flex items-center justify-center shadow-sm">
          <Image src="/logo.png" alt="NusaAI" width={18} height={18} />
        </div>
        <div>
          <p className="text-xs font-bold text-zinc-900 leading-none">NusaAI</p>
          <p className="text-[10px] text-green-500 font-semibold mt-0.5">Online</p>
        </div>
        <div className="ml-auto flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-zinc-200" />
          <div className="w-2.5 h-2.5 rounded-full bg-zinc-200" />
          <div className="w-2.5 h-2.5 rounded-full bg-brand-red/60" />
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto px-5 py-5 space-y-4 scroll-smooth overscroll-y-contain [-webkit-overflow-scrolling:touch]">
        <AnimatePresence mode="popLayout">
          {messages.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center h-full gap-5 text-center"
            >
              <div className="w-12 h-12 bg-zinc-50 border border-zinc-100 rounded-2xl flex items-center justify-center">
                <Image src="/logo.png" alt="NusaAI" width={24} height={24} />
              </div>
              <p className="text-sm text-zinc-500 font-medium">Coba tanya sesuatu, atau pilih topik:</p>
              <div className="flex flex-wrap justify-center gap-2">
                {QUICK_PROMPTS.map(p => (
                  <button
                    key={p}
                    onClick={() => send(p)}
                    className="text-[11px] font-semibold px-3 py-1.5 rounded-full bg-zinc-50 border border-zinc-100 text-zinc-600 hover:border-brand-red/30 hover:text-brand-red hover:bg-brand-red/5 transition-all"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            messages.map((msg, i) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="w-full"
              >
                <MessageBubble
                  message={msg}
                  isStreaming={
                    isLoading &&
                    i === messages.length - 1 &&
                    msg.role === "assistant"
                  }
                />
              </motion.div>
            ))
          )}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 pb-4 pt-2 flex-shrink-0">
        <div className="flex items-center gap-2 bg-zinc-50 border border-zinc-200 rounded-2xl px-4 py-2.5 focus-within:border-brand-red/30 focus-within:ring-2 focus-within:ring-brand-red/5 transition-all">
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder="Tanya NusaAI sesuatu..."
            className="flex-1 bg-transparent text-[13px] text-zinc-900 placeholder:text-zinc-400 focus:outline-none"
            disabled={isLoading}
          />
          {isLoading ? (
            <button onClick={stop} className="w-7 h-7 rounded-xl bg-zinc-900 flex items-center justify-center hover:bg-red-600 transition-colors flex-shrink-0">
              <Square className="w-3 h-3 fill-white text-white" />
            </button>
          ) : (
            <button
              onClick={() => send()}
              disabled={!input.trim()}
              className="w-7 h-7 rounded-xl bg-zinc-900 flex items-center justify-center hover:bg-zinc-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0"
            >
              <Send className="w-3 h-3 text-white" />
            </button>
          )}
        </div>
        <p className="text-[9px] text-center text-zinc-400 mt-2">
          Preview gratis — <Link href="/demo" className="text-brand-red font-semibold hover:underline">Demo penuh</Link> untuk akses lebih banyak
        </p>
      </div>
    </div>
  );
}
