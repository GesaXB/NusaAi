"use client";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { ChatWindow } from "@/components/chat/chat-window";
import type { Message } from "@/types";

interface ChatIdClientProps {
  id: string;
  initialMessages: Message[];
}

export default function ChatIdClient({ id, initialMessages }: ChatIdClientProps) {
  return (
    <DashboardShell initialChatId={id} initialMessages={initialMessages}>
      {({ 
        messages, 
        isLoading, 
        isLimitReached, 
        send, 
        stop, 
        removeChat, 
        editMessage, 
        regenerate, 
        modelId 
      }) => (
        <ChatWindow
          messages={messages}
          isLoading={isLoading}
          isLimitReached={isLimitReached}
          onSend={send}
          onStop={stop}
          onClear={removeChat}
          modelId={modelId}
          onEdit={editMessage}
          onRegenerate={regenerate}
        />
      )}
    </DashboardShell>
  );
}
