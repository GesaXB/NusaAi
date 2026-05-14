"use client";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { ChatWindow } from "@/components/chat/chat-window";

export default function DashboardClient() {
  return (
    <DashboardShell>
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
