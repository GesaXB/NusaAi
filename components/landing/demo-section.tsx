"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Send } from "lucide-react";
import { MessageBubble, TypingIndicator } from "@/components/chat/message-bubble";
import type { Message } from "@/types";

const CHAT_MESSAGES: Message[] = [
  {
    id: "land-u1",
    role: "user",
    content: "Jelaskan tentang fotosintesis dengan bahasa yang mudah dipahami",
  },
  {
    id: "land-a1",
    role: "assistant",
    content: `## Konsep Fotosintesis

Fotosintesis adalah proses kimia pada tumbuhan, alga, dan beberapa bakteri untuk mengubah cahaya menjadi energi kimia yang disimpan dalam glukosa.

### Proses Fotosintesis

- **Penyerapan cahaya:** Klorofil menangkap energi cahaya matahari.
- **Konversi energi:** Energi cahaya diubah menjadi ATP dan NADPH.
- **Ikatan CO₂ dan H₂O:** Karbon dioksida dari udara dan air dari akar dipakai dalam reaksi gelap.
- **Hasil:** Terbentuk glukosa sebagai cadangan energi dan oksigen dilepas ke udara.

### Reaksi Fotosintesis

\`6 CO₂ + 6 H₂O + cahaya → C₆H₁₂O₆ (glukosa) + 6 O₂\`

### Faktor-Faktor Fotosintesis

- **Cahaya:** Intensitas dan durasi cahaya memengaruhi laju fotosintesis.
- **Suhu:** Enzim bekerja optimal pada rentang suhu tertentu.
- **Air dan CO₂:** Ketersediaan bahan baku membatasi hasil akhir.`,
  },
  {
    id: "land-u2",
    role: "user",
    content: "Bisa buatkan rumusnya?",
  },
  {
    id: "land-a2",
    role: "assistant",
    content: `## Rumus Reaksi

Persamaan ringkas fotosintesis:

\`6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂\`

Di bawah pengaruh cahaya dan klorofil, enam molekul karbon dioksida dan enam molekul air menghasilkan satu molekul glukosa dan enam molekul oksigen.`,
  },
];

export function DemoSection() {
  const [visibleCount, setVisibleCount] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (visibleCount >= CHAT_MESSAGES.length) return;

    const delay = CHAT_MESSAGES[visibleCount]?.role === "assistant" ? 1200 : 600;

    setIsTyping(true);
    const timer = setTimeout(() => {
      setIsTyping(false);
      setVisibleCount((c) => c + 1);
    }, delay);

    return () => clearTimeout(timer);
  }, [visibleCount]);

  return (
    <section id="demo" className="scroll-mt-28 py-24 md:py-32 bg-zinc-50">
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

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="max-w-3xl mx-auto"
        >
          <div className="rounded-2xl border border-zinc-200 bg-white shadow-xl shadow-zinc-200/40 overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-3.5 border-b border-zinc-100 bg-zinc-50/80">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-zinc-200" />
                <div className="w-3 h-3 rounded-full bg-zinc-200" />
                <div className="w-3 h-3 rounded-full bg-zinc-200" />
              </div>
              <div className="flex-1 flex items-center justify-center">
                <span className="text-xs font-medium text-zinc-400">NusaAI Chat</span>
              </div>
              <div className="w-12" />
            </div>

            <div className="p-5 md:p-8 space-y-6 min-h-[400px] max-h-[520px] overflow-y-auto overscroll-y-contain [-webkit-overflow-scrolling:touch]">
              {CHAT_MESSAGES.slice(0, visibleCount).map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full"
                >
                  <MessageBubble message={msg} />
                </motion.div>
              ))}

              {isTyping && visibleCount < CHAT_MESSAGES.length && (
                <TypingIndicator />
              )}
            </div>

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
