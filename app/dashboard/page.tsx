"use client";

import { useState } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";
import { ChatWindow } from "@/components/chat/chat-window";
import { AI_MODELS } from "@/types";
import { useChat } from "@/hooks/use-chat";

export default function DashboardPage() {
  const [modelId, setModelId] = useState(AI_MODELS[0].id);
  const { messages, isLoading, isLimitReached, send, stop, reset } = useChat(modelId);

  return (
    <div className="flex h-screen bg-zinc-50 overflow-hidden">
      <Sidebar onNewChat={reset} />
      <div className="flex flex-col flex-1 min-w-0">
        <Topbar
          modelId={modelId}
          onModelChange={setModelId}
          userName="Pengguna"
        />
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
