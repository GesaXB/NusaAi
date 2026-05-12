"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Bot, User, Send } from "lucide-react";

const CHAT_MESSAGES = [
  {
    role: "user" as const,
    text: "Jelaskan tentang fotosintesis dengan bahasa yang mudah dipahami",
  },
  {
    role: "ai" as const,
    text: "Fotosintesis itu seperti \"memasak\" yang dilakukan oleh tumbuhan 🌱\n\nBahan-bahannya:\n• Cahaya matahari ☀️ (sebagai energi)\n• Air (H₂O) dari akar\n• Karbon dioksida (CO₂) dari udara\n\nHasilnya:\n• Glukosa (C₆H₁₂O₆) — makanan bagi tumbuhan\n• Oksigen (O₂) — yang kita hirup!\n\nProses ini terjadi di kloroplas, tepatnya di bagian yang mengandung klorofil (pigmen hijau). Makanya daun berwarna hijau! 🍃",
  },
  {
    role: "user" as const,
    text: "Bisa buatkan rumusnya?",
  },
  {
    role: "ai" as const,
    text: "Tentu! Ini rumus reaksi fotosintesis:\n\n6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂\n           (cahaya + klorofil)\n\nArtinya: 6 molekul karbon dioksida + 6 molekul air, dengan bantuan cahaya & klorofil, menghasilkan 1 molekul glukosa + 6 molekul oksigen.",
  },
];

function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-zinc-400"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </div>
  );
}

export function DemoSection() {
  const [visibleCount, setVisibleCount] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (visibleCount >= CHAT_MESSAGES.length) return;

    const delay = CHAT_MESSAGES[visibleCount]?.role === "ai" ? 1200 : 600;

    setIsTyping(true);
    const timer = setTimeout(() => {
      setIsTyping(false);
      setVisibleCount((c) => c + 1);
    }, delay);

    return () => clearTimeout(timer);
  }, [visibleCount]);

  return (
    <section id="demo" className="py-24 md:py-32 bg-zinc-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-2xl mb-14">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-brand-red font-semibold text-sm tracking-wide mb-3"
          >
            Preview
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="text-3xl md:text-[2.75rem] font-bold text-zinc-900 leading-[1.15] tracking-tight"
          >
            Seperti ngobrol dengan tutor pribadi.
          </motion.h2>
        </div>

        {/* Chat Preview Window */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="max-w-3xl mx-auto"
        >
          <div className="rounded-2xl border border-zinc-200 bg-white shadow-xl shadow-zinc-200/40 overflow-hidden">
            {/* Window Bar */}
            <div className="flex items-center gap-2 px-5 py-3.5 border-b border-zinc-100 bg-zinc-50/80">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-zinc-200" />
                <div className="w-3 h-3 rounded-full bg-zinc-200" />
                <div className="w-3 h-3 rounded-full bg-zinc-200" />
              </div>
              <div className="flex-1 flex items-center justify-center">
                <span className="text-xs font-medium text-zinc-400">
                  NusaAI Chat
                </span>
              </div>
              <div className="w-12" />
            </div>

            {/* Messages */}
            <div className="p-5 md:p-8 space-y-5 min-h-[400px] max-h-[520px] overflow-y-auto">
              {CHAT_MESSAGES.slice(0, visibleCount).map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex gap-3 ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.role === "ai" && (
                    <div className="w-8 h-8 rounded-full bg-brand-red/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="w-4 h-4 text-brand-red" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line ${
                      msg.role === "user"
                        ? "bg-zinc-900 text-white rounded-br-md"
                        : "bg-zinc-50 text-zinc-700 border border-zinc-100 rounded-bl-md"
                    }`}
                  >
                    {msg.text}
                  </div>
                  {msg.role === "user" && (
                    <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center shrink-0 mt-0.5">
                      <User className="w-4 h-4 text-zinc-500" />
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Typing indicator */}
              {isTyping && visibleCount < CHAT_MESSAGES.length && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 rounded-full bg-brand-red/10 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 text-brand-red" />
                  </div>
                  <div className="bg-zinc-50 border border-zinc-100 rounded-2xl rounded-bl-md">
                    <TypingDots />
                  </div>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <div className="px-5 md:px-8 pb-5 md:pb-8">
              <div className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3">
                <span className="flex-1 text-sm text-zinc-400">
                  Tanya apa saja ke NusaAI...
                </span>
                <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center">
                  <Send className="w-3.5 h-3.5 text-white" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
