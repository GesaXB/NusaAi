"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";
import { ChatWindow } from "@/components/chat/chat-window";
import { AI_MODELS } from "@/types";
import { useChat } from "@/hooks/use-chat";
import { Menu } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function DashboardPage() {
  const [modelId, setModelId] = useState(AI_MODELS[0].id);
  const { messages, isLoading, isLimitReached, send, stop, reset } = useChat(modelId);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!sidebarOpen) {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.documentElement.style.overflow = "";
      return;
    }
    const scrollY = window.scrollY;
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.documentElement.style.overflow = "";
      window.scrollTo(0, scrollY);
    };
  }, [sidebarOpen]);

  return (
    <div className="flex h-[100dvh] min-h-0 bg-zinc-50 overflow-hidden relative">
      {/* Desktop sidebar */}
      <div className="hidden md:block h-full min-h-0 shrink-0">
        <Sidebar onNewChat={reset} />
      </div>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 bottom-0 z-50 md:hidden w-[min(100%,17rem)] h-[100dvh] max-h-[100dvh] overflow-hidden overscroll-contain shadow-2xl"
            >
              <Sidebar onNewChat={() => { reset(); setSidebarOpen(false); }} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex flex-col flex-1 min-w-0 min-h-0">
        {/* Topbar with mobile menu button */}
        <div className="flex items-center">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-2.5 ml-2 rounded-xl text-zinc-500 hover:bg-zinc-100 transition-all flex-shrink-0"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0">
            <Topbar
              modelId={modelId}
              onModelChange={setModelId}
              userName="Pengguna"
            />
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <ChatWindow
            messages={messages}
            isLoading={isLoading}
            isLimitReached={isLimitReached}
            onSend={send}
            onStop={stop}
            onClear={reset}
            modelId={modelId}
          />
        </div>
      </div>
    </div>
  );
}
