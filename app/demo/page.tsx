"use client";

import { useRef, useEffect, useState } from "react";
import { MessageBubble, TypingIndicator } from "@/components/chat/message-bubble";
import { PromptInput } from "@/components/chat/prompt-input";
import { BookOpen, FileText, Brain, Sparkles, Lock, ArrowRight, Menu, X } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { generateId } from "@/lib/utils";
import { createSseDeltaParser } from "@/lib/sse-delta-parser";
import { createStreamMessageUpdater } from "@/lib/stream-message-updater";
import type { Message } from "@/types";
import { SYSTEM_PROMPT } from "@/types";

const FREE_MODEL = "meta-llama/llama-3.1-8b-instruct";

const STARTER_PROMPTS = [
  { icon: BookOpen, label: "Jelaskan konsep dasar", prompt: "Jelaskan konsep dasar kalkulus dengan cara yang mudah dipahami" },
  { icon: FileText, label: "Ringkaskan materi", prompt: "Ringkaskan materi tentang sistem pernapasan manusia" },
  { icon: Brain, label: "Buat soal latihan", prompt: "Buat 5 soal pilihan ganda tentang sejarah kemerdekaan Indonesia" },
  { icon: Sparkles, label: "Tanya apa saja", prompt: "Apa perbedaan antara mitosis dan meiosis?" },
];

const LIMIT = 5; // Max AI responses for demo

export default function DemoPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [aiCount, setAiCount] = useState(0); // count AI responses
  const abortRef = useRef<AbortController | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const isLimitReached = aiCount >= LIMIT;
  const isEmpty = messages.length === 0;

  // Load from sessionStorage (demo — not persistent like dashboard)
  useEffect(() => {
    const saved = sessionStorage.getItem("nusa_demo_chat");
    if (saved) {
      try {
        const { msgs, count } = JSON.parse(saved);
        setMessages(msgs.map((m: any) => ({ ...m, createdAt: m.createdAt ? new Date(m.createdAt) : undefined })));
        setAiCount(count ?? 0);
      } catch {}
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      const count = messages.filter(m => m.role === "assistant").length;
      sessionStorage.setItem("nusa_demo_chat", JSON.stringify({ msgs: messages, count }));
    }
  }, [messages]);

  useEffect(() => {
    if (messages.length > 0 || isLoading) {
      const id = requestAnimationFrame(() => {
        const el = scrollRef.current;
        if (el) {
          el.scrollTo({
            top: el.scrollHeight,
            behavior: isLoading ? "auto" : "smooth",
          });
        }
      });
      return () => cancelAnimationFrame(id);
    }
  }, [messages, isLoading]);

  const stop = () => {
    abortRef.current?.abort();
    setIsLoading(false);
  };

  const send = async (content: string) => {
    if (isLoading || isLimitReached) return;

    abortRef.current?.abort();
    abortRef.current = new AbortController();

    const userMsg: Message = { id: generateId(), role: "user", content, createdAt: new Date() };
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
          modelId: FREE_MODEL,
          systemPrompt: SYSTEM_PROMPT,
        }),
      });

      if (!response.ok || !response.body) throw new Error(`HTTP ${response.status}`);

      const assistantId = generateId();
      setMessages(prev => [...prev, { id: assistantId, role: "assistant", content: "", createdAt: new Date() }]);
      setAiCount(prev => prev + 1);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      const sse = createSseDeltaParser();
      const stream = createStreamMessageUpdater(setMessages, assistantId);

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
      setMessages(prev => [...prev, {
        id: generateId(), role: "assistant",
        content: "Maaf, terjadi kesalahan. Silakan coba lagi.",
        createdAt: new Date(),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen min-h-0 bg-zinc-50">
      {/* Minimal Topbar */}
      <header className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-zinc-100 bg-white/80 backdrop-blur-md sticky top-0 z-30">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt="NusaAI" width={24} height={24} className="rounded-lg" />
          <span className="font-bold text-sm sm:text-base text-zinc-900 tracking-tight">Nusa<span className="text-brand-red">AI</span></span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          {!isLimitReached && (
            <div className="flex items-center gap-1 sm:gap-1.5 bg-zinc-50 border border-zinc-100 rounded-full px-2 sm:px-3 py-1">
              <div className="flex gap-0.5">
                {Array.from({ length: LIMIT }).map((_, i) => (
                  <div key={i} className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-colors ${i < aiCount ? "bg-brand-red" : "bg-zinc-200"}`} />
                ))}
              </div>
              <span className="text-[9px] sm:text-[10px] font-bold text-zinc-400 ml-0.5 sm:ml-1">{aiCount}/{LIMIT}</span>
            </div>
          )}
          <Link href="/login" className="hidden sm:block text-xs font-bold text-zinc-600 hover:text-brand-red transition-colors px-3 py-1.5 rounded-lg hover:bg-zinc-50 border border-transparent hover:border-zinc-100">
            Masuk
          </Link>
          <Link href="/login" className="text-[11px] sm:text-xs font-bold bg-zinc-900 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl hover:bg-zinc-800 transition-colors shadow-sm">
            Daftar Gratis
          </Link>
        </div>
      </header>

      {/* Chat Area */}
      <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto px-3 sm:px-4 md:px-8 py-6 sm:py-8 scroll-smooth overscroll-y-contain [-webkit-overflow-scrolling:touch]">
        <AnimatePresence mode="wait">
          {isEmpty ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center min-h-[50vh] sm:min-h-[60vh] gap-6 sm:gap-10 text-center px-2"
            >
              <div className="space-y-4">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="w-16 h-16 rounded-2xl bg-white border border-zinc-100 shadow-sm flex items-center justify-center mx-auto ring-8 ring-white/50"
                >
                  <Image src="/logo.png" alt="NusaAI" width={32} height={32} />
                </motion.div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight mb-2">Halo! Saya NusaAI</h2>
                  <p className="text-zinc-500 max-w-sm mx-auto leading-relaxed text-sm">
                    Coba NusaAI secara gratis — kamu mendapat <strong className="text-zinc-900">{LIMIT} percakapan</strong> demo tanpa perlu login.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full max-w-2xl">
                {STARTER_PROMPTS.map((s, i) => {
                  const Icon = s.icon;
                  return (
                    <motion.button
                      key={s.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 + 0.2 }}
                      onClick={() => send(s.prompt)}
                      className="flex items-start gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl border border-zinc-100 bg-white hover:border-brand-red/30 hover:shadow-lg hover:shadow-brand-red/5 text-left transition-all duration-300 group"
                    >
                      <div className="p-2.5 rounded-xl bg-zinc-50 group-hover:bg-brand-red/10 transition-colors flex-shrink-0">
                        <Icon className="w-4 h-4 text-zinc-400 group-hover:text-brand-red transition-colors" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-zinc-900 mb-1 group-hover:text-brand-red transition-colors">{s.label}</p>
                        <p className="text-[11px] text-zinc-400 leading-relaxed line-clamp-2">{s.prompt}</p>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="max-w-3xl mx-auto w-full space-y-8"
            >
              <AnimatePresence mode="popLayout">
                {messages.map((msg, i) => (
                  <MessageBubble
                    key={msg.id}
                    message={msg}
                    isStreaming={isLoading && i === messages.length - 1 && msg.role === "assistant"}
                  />
                ))}
              </AnimatePresence>
              {isLoading && messages[messages.length - 1]?.role !== "assistant" && <TypingIndicator />}

              {/* Limit Wall */}
              {isLimitReached && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 150, damping: 20 }}
                  className="p-8 rounded-3xl bg-zinc-900 text-white text-center space-y-5 shadow-2xl"
                >
                  <div className="w-12 h-12 bg-brand-red/20 rounded-2xl flex items-center justify-center mx-auto">
                    <Lock className="w-6 h-6 text-brand-red" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">Demo selesai</h3>
                    <p className="text-zinc-400 text-sm max-w-xs mx-auto leading-relaxed">
                      Kamu telah mencoba {LIMIT} percakapan gratis. Daftar sekarang untuk akses penuh tanpa batas.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                      href="/login"
                      className="px-8 py-3 bg-brand-red hover:bg-brand-red-dark rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 group"
                    >
                      Daftar Sekarang — Gratis
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                      href="/login"
                      className="px-8 py-3 bg-white/10 hover:bg-white/15 rounded-xl font-bold text-sm transition-all border border-white/10"
                    >
                      Sudah punya akun? Masuk
                    </Link>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={bottomRef} className="h-4" />
      </div>

      {/* Input */}
      <div className="px-4 md:px-8 pb-6 pt-3 bg-gradient-to-t from-zinc-50 to-transparent">
        <div className="max-w-3xl mx-auto space-y-2">
          <div className={isLimitReached ? "opacity-40 pointer-events-none" : ""}>
            <PromptInput
              onSend={send}
              onStop={stop}
              isLoading={isLoading}
              placeholder={isLimitReached ? "Daftar untuk lanjut..." : "Tanya NusaAI sesuatu..."}
            />
          </div>
          <p className="text-[10px] text-center text-zinc-400 font-medium">
            NusaAI dapat membuat kesalahan. Demo gratis — {LIMIT - aiCount > 0 ? `${LIMIT - aiCount} percakapan tersisa.` : "batas tercapai."}
          </p>
        </div>
      </div>
    </div>
  );
}
