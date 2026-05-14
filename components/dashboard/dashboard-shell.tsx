"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";
import { AI_MODELS } from "@/types";
import { useChat } from "@/hooks/use-chat";
import { AnimatePresence, motion } from "framer-motion";
import { getRecentChats } from "@/lib/actions/chat";
import type { Chat } from "@/types";
import { usePathname, useRouter } from "next/navigation";

interface DashboardShellProps {
  children: React.ReactNode | ((props: any) => React.ReactNode);
  initialChatId?: string | null;
  initialMessages?: any[];
}

export function DashboardShell({ children, initialChatId, initialMessages }: DashboardShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [modelId, setModelId] = useState(AI_MODELS[0].id);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [recentChats, setRecentChats] = useState<Chat[]>([]);

  const chatProps = useChat(modelId, { 
    initialChatId, 
    initialMessages 
  });

  const fetchChats = async () => {
    const chats = await getRecentChats();
    setRecentChats(chats as Chat[]);
  };

  useEffect(() => {
    fetchChats();
    
    const handleSync = () => fetchChats();
    window.addEventListener("chat-updated", handleSync);
    return () => window.removeEventListener("chat-updated", handleSync);
  }, []);

  // Sync sidebar when a new chat is created
  useEffect(() => {
    if (chatProps.chatId) {
      fetchChats();
    }
  }, [chatProps.chatId]);

  // Close sidebar on navigation
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const handleNewChat = () => {
    localStorage.removeItem("nusa_ai_chat_history");
    chatProps.reset();
    setSidebarOpen(false);
    if (pathname !== "/dashboard") {
      router.push("/dashboard");
    }
  };

  const handleLogout = async () => {
    // Topbar handles logout confirm, this is for direct action if needed
  };

  return (
    <div className="flex h-[100dvh] w-full bg-white overflow-hidden selection:bg-brand-red/10">
      {/* Desktop Sidebar (Fixed) */}
      <div className="hidden md:block h-full shrink-0 border-r border-zinc-100">
        <Sidebar onNewChat={handleNewChat} chats={recentChats} />
      </div>

      {/* Mobile Sidebar (Drawer) */}
      <AnimatePresence>
        {sidebarOpen && (
          <div className="fixed inset-0 z-[100] md:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute left-0 top-0 bottom-0 w-[280px] bg-white shadow-2xl"
            >
              <Sidebar onNewChat={handleNewChat} chats={recentChats} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex flex-col flex-1 min-w-0 relative h-full">
        <Topbar
          modelId={modelId}
          onModelChange={setModelId}
          userName={chatProps.user?.user_metadata?.full_name || chatProps.user?.email?.split("@")[0] || "Pengguna"}
          userAvatar={chatProps.user?.user_metadata?.avatar_url}
          onMenuClick={() => setSidebarOpen(true)}
        />
        
        <div className="flex-1 relative overflow-hidden h-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="h-full w-full"
            >
              {typeof children === "function" 
                ? children({ ...chatProps, modelId, setModelId }) 
                : children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
