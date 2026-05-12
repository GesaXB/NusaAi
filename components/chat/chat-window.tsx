"use client";

import { useRef, useEffect } from "react";
import { MessageBubble, TypingIndicator } from "@/components/chat/message-bubble";
import { PromptInput } from "@/components/chat/prompt-input";
import { BookOpen, FileText, Brain, Sparkles, Trash2, Lock, ArrowRight } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import type { Message } from "@/types";

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
  isLimitReached?: boolean;
  onSend: (content: string) => void;
  onStop?: () => void;
  onClear?: () => void;
  modelId: string;
}

const STARTER_PROMPTS = [
  { icon: BookOpen, label: "Jelaskan konsep dasar", prompt: "Jelaskan konsep dasar kalkulus dengan cara yang mudah dipahami" },
  { icon: FileText, label: "Ringkaskan materi", prompt: "Ringkaskan materi tentang sistem pernapasan manusia" },
  { icon: Brain, label: "Buat soal latihan", prompt: "Buat 5 soal pilihan ganda tentang sejarah kemerdekaan Indonesia" },
  { icon: Sparkles, label: "Tanya apa saja", prompt: "Apa perbedaan antara mitosis dan meiosis?" },
];

export function ChatWindow({ 
  messages, 
  isLoading, 
  isLimitReached, 
  onSend, 
  onStop,
  onClear, 
  modelId 
}: ChatWindowProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (messages.length > 0 || isLoading) {
      const timer = setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 80);
      return () => clearTimeout(timer);
    }
  }, [messages, isLoading]);

  const isEmpty = messages.length === 0;

  return (
    <div className="flex flex-col h-full bg-zinc-50/30">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-4 md:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8 scroll-smooth">
        <AnimatePresence mode="wait">
          {isEmpty ? (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center justify-center h-full gap-6 sm:gap-10 text-center py-6 sm:py-10 px-2"
            >
              {/* Welcome */}
              <div className="space-y-4">
                <motion.div
                  initial={{ scale: 0.8, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="w-16 h-16 rounded-2xl bg-white border border-zinc-100 shadow-sm flex items-center justify-center mx-auto mb-6 ring-8 ring-white/50"
                >
                  <Image src="/logo.png" alt="NusaAI" width={32} height={32} />
                </motion.div>
                <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">
                  Halo! Saya NusaAI 👋
                </h2>
                <p className="text-zinc-500 max-w-sm mx-auto leading-relaxed">
                  Asisten belajar AI untuk pelajar Indonesia. Tanyakan apa saja — saya siap membantu belajarmu hari ini.
                </p>
              </div>

              {/* Starter prompts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full max-w-2xl px-2 sm:px-4">
                {STARTER_PROMPTS.map((starter, i) => {
                  const Icon = starter.icon;
                  return (
                    <motion.button
                      key={starter.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 + 0.3 }}
                      onClick={() => !isLimitReached && onSend(starter.prompt)}
                      disabled={isLimitReached}
                      className="flex items-start gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl border border-zinc-100 bg-white hover:border-brand-red/30 hover:shadow-xl hover:shadow-brand-red/5 text-left transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="p-2.5 rounded-xl bg-zinc-50 group-hover:bg-brand-red/10 transition-colors flex-shrink-0">
                        <Icon className="w-4 h-4 text-zinc-400 group-hover:text-brand-red transition-colors" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-zinc-900 mb-1 group-hover:text-brand-red transition-colors">{starter.label}</p>
                        <p className="text-[11px] text-zinc-400 leading-relaxed line-clamp-2">{starter.prompt}</p>
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
              className="max-w-4xl mx-auto w-full space-y-8"
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
              {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
                <TypingIndicator />
              )}
              
              {/* Limit Reached UI */}
              {isLimitReached && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-8 rounded-3xl bg-zinc-900 text-white text-center space-y-6 shadow-2xl shadow-zinc-200 border border-zinc-800"
                >
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mx-auto">
                    <Lock className="w-6 h-6 text-brand-red" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">Batas Gratis Tercapai</h3>
                    <p className="text-zinc-400 text-sm max-w-xs mx-auto">
                      Kamu telah menggunakan 5 pesan gratis. Masuk sekarang untuk akses tak terbatas dan fitur premium lainnya.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Link 
                      href="/login"
                      className="w-full sm:w-auto px-8 py-3 bg-brand-red hover:bg-brand-red-dark rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 group"
                    >
                      Masuk Sekarang
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <button 
                      onClick={onClear}
                      className="w-full sm:w-auto px-8 py-3 bg-white/5 hover:bg-white/10 rounded-xl font-bold text-sm transition-all border border-white/10"
                    >
                      Hapus History
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={bottomRef} className="h-4" />
      </div>

      {/* Input Area */}
      <div className="px-3 sm:px-4 md:px-8 pb-4 sm:pb-6 bg-gradient-to-t from-zinc-50/80 to-transparent pt-3 sm:pt-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {/* Action Toolbar */}
          {!isEmpty && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between px-2"
            >
              <div className="flex items-center gap-2">
                <span className={cn(
                  "text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md transition-colors",
                  isLimitReached ? "bg-red-100 text-red-600" : "bg-zinc-100 text-zinc-400"
                )}>
                  {isLimitReached ? "Limit Tercapai" : "Percakapan Aktif"}
                </span>
              </div>
              {!isLimitReached && (
                <button
                  onClick={onClear}
                  className="flex items-center gap-1.5 text-xs font-bold text-zinc-400 hover:text-red-500 transition-all bg-white hover:bg-red-50 px-3.5 py-1.5 rounded-xl border border-zinc-100 hover:border-red-100 shadow-sm"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Hapus Chat
                </button>
              )}
            </motion.div>
          )}

          <div className={isLimitReached ? "opacity-50 pointer-events-none" : ""}>
            <PromptInput 
              onSend={onSend} 
              onStop={onStop}
              isLoading={isLoading} 
              placeholder={isLimitReached ? "Login untuk lanjut bertanya..." : undefined} 
            />
          </div>
          <p className="text-[10px] text-center text-zinc-400 mt-3 font-medium opacity-60">
            NusaAI dapat membuat kesalahan. Pertimbangkan untuk memeriksa informasi penting.
          </p>
        </div>
      </div>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
