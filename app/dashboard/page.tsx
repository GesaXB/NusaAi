"use client";

import { useState } from "react";
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

  return (
    <div className="flex h-screen bg-zinc-50 overflow-hidden relative">
      {/* Desktop sidebar */}
      <div className="hidden md:block">
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
              className="fixed left-0 top-0 bottom-0 z-50 md:hidden"
            >
              <Sidebar onNewChat={() => { reset(); setSidebarOpen(false); }} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex flex-col flex-1 min-w-0">
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
