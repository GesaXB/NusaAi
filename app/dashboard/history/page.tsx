"use client";

import { useState } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";
import { AI_MODELS } from "@/types";
import { MessageSquare, Clock, Trash2, Search, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

// Mock history data
const MOCK_CHATS = [
  { id: "1", title: "Penjelasan Integral dalam Kalkulus", createdAt: new Date("2025-05-11") },
  { id: "2", title: "Hukum Newton dan Aplikasinya", createdAt: new Date("2025-05-10") },
  { id: "3", title: "Sejarah Proklamasi Kemerdekaan Indonesia", createdAt: new Date("2025-05-10") },
  { id: "4", title: "Fotosintesis dan Respirasi Seluler", createdAt: new Date("2025-05-09") },
  { id: "5", title: "Soal Latihan UN Matematika 2024", createdAt: new Date("2025-05-08") },
  { id: "6", title: "Tata Bahasa Indonesia — Kalimat Efektif", createdAt: new Date("2025-05-07") },
];

export default function HistoryPage() {
  const [modelId, setModelId] = useState(AI_MODELS[0].id);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading
  useState(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  });

  const filtered = MOCK_CHATS.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-zinc-50 overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <Topbar modelId={modelId} onModelChange={setModelId} userName="Pengguna" />

        <div className="flex-1 overflow-y-auto p-6 lg:p-10 bg-zinc-50">
          <div className="max-w-2xl mx-auto w-full">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl font-bold text-zinc-900 mb-1">Riwayat Chat</h1>
                <p className="text-zinc-500 text-sm">Semua percakapan kamu dengan NusaAI.</p>
              </div>
            </div>

            <div className="relative mb-8">
              <Input
                placeholder="Cari riwayat percakapan..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                icon={<Search className="w-4 h-4" />}
                className="bg-white border-zinc-200 h-12 shadow-sm focus:shadow-md transition-shadow"
              />
            </div>

            <div className="flex flex-col gap-3">
              <AnimatePresence>
                {isLoading ? (
                  // Skeleton Loading State
                  [1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-2xl border border-zinc-100 bg-white">
                      <Skeleton className="w-12 h-12 rounded-xl" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4 rounded" />
                        <Skeleton className="h-3 w-1/4 rounded" />
                      </div>
                      <Skeleton className="w-8 h-8 rounded-lg" />
                    </div>
                  ))
                ) : filtered.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-20 bg-white rounded-3xl border border-zinc-100 shadow-sm"
                  >
                    <div className="w-16 h-16 bg-zinc-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <MessageSquare className="w-8 h-8 text-zinc-300" />
                    </div>
                    <p className="text-zinc-500 font-medium">Tidak ada riwayat ditemukan</p>
                    <p className="text-zinc-400 text-sm mt-1">Coba kata kunci lain atau mulai chat baru.</p>
                  </motion.div>
                ) : (
                  filtered.map((chat, i) => (
                    <motion.div
                      key={chat.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="group flex items-center gap-4 p-4 rounded-2xl border border-zinc-100 bg-white hover:border-brand-red/20 hover:shadow-xl hover:shadow-zinc-200/40 transition-all cursor-pointer relative"
                    >
                      <Link href={`/dashboard/chat/${chat.id}`} className="absolute inset-0 z-0" />
                      
                      <div className="w-12 h-12 rounded-xl bg-zinc-50 flex items-center justify-center flex-shrink-0 group-hover:bg-brand-red/5 transition-colors z-10">
                        <MessageSquare className="w-5 h-5 text-zinc-400 group-hover:text-brand-red transition-colors" />
                      </div>
                      
                      <div className="flex-1 min-w-0 z-10">
                        <p className="text-sm font-bold text-zinc-900 group-hover:text-brand-red transition-colors truncate mb-1">
                          {chat.title}
                        </p>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-zinc-400" />
                            <p className="text-xs text-zinc-400 font-medium">{formatDate(chat.createdAt)}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 z-10">
                        <button className="p-2 rounded-lg text-zinc-300 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100">
                          <Trash2 className="w-4.5 h-4.5" />
                        </button>
                        <ArrowRight className="w-4 h-4 text-zinc-300 group-hover:text-brand-red group-hover:translate-x-1 transition-all" />
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
