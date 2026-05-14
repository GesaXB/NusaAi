"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { MessageSquare, Clock, Trash2, Search, ArrowRight, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { getRecentChats, deleteChat } from "@/lib/actions/chat";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";

export default function HistoryPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [chats, setChats] = useState<{id: string, title: string, createdAt: Date}[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchHistory = async () => {
    const data = await getRecentChats();
    setChats(data as any);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchHistory();
    
    // Sync if a chat is created/deleted elsewhere
    window.addEventListener("chat-updated", fetchHistory);
    return () => window.removeEventListener("chat-updated", fetchHistory);
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    const id = deleteId;
    setChats(prev => prev.filter(c => c.id !== id));
    setDeleteId(null);
    await deleteChat(id);
    window.dispatchEvent(new CustomEvent("chat-updated"));
  };

  const confirmDelete = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDeleteId(id);
  };

  const filtered = chats.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardShell>
      <div className="h-full overflow-y-auto p-4 sm:p-6 lg:p-10 bg-zinc-50/50">
        <div className="max-w-2xl mx-auto w-full">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-zinc-900 mb-1 tracking-tight">Riwayat Chat</h1>
              <p className="text-zinc-500 text-sm">Semua percakapan kamu dengan NusaAI.</p>
            </div>
          </div>

          <div className="relative mb-8">
            <Input
              placeholder="Cari riwayat percakapan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={<Search className="w-4 h-4" />}
              className="bg-white border-zinc-200 h-12 shadow-sm focus:shadow-md transition-shadow rounded-2xl"
            />
          </div>

          <div className="flex flex-col gap-3">
            <AnimatePresence mode="popLayout">
              {isLoading ? (
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
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.05 }}
                    layout
                    onClick={() => router.push(`/dashboard/chat/${chat.id}`)}
                    className="group flex items-center gap-4 p-4 rounded-2xl border border-zinc-100 bg-white hover:border-brand-red/20 hover:shadow-xl hover:shadow-zinc-200/40 transition-all cursor-pointer relative"
                  >
                    
                    <div className="w-12 h-12 rounded-xl bg-zinc-50 flex items-center justify-center shrink-0 group-hover:bg-brand-red/5 transition-colors z-10">
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
                      <button 
                        onClick={(e) => confirmDelete(e, chat.id)}
                        className="p-2 rounded-lg text-zinc-300 hover:text-red-500 hover:bg-red-50 transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100"
                        title="Hapus"
                      >
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

      {/* Custom Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteId && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteId(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-zinc-100 text-center"
            >
              <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 mb-2">Hapus Percakapan?</h3>
              <p className="text-zinc-500 text-sm mb-8">
                Tindakan ini tidak dapat dibatalkan. Riwayat chat ini akan dihapus permanen.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteId(null)}
                  className="flex-1 px-4 py-3 rounded-xl bg-zinc-50 hover:bg-zinc-100 text-zinc-600 font-bold text-sm transition-all"
                >
                  Batal
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 px-4 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-sm transition-all shadow-lg shadow-red-200"
                >
                  Hapus
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DashboardShell>
  );
}
