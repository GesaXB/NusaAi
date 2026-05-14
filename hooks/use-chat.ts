"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import type { Message } from "@/types";
import { generateId } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { createSseDeltaParser } from "@/lib/sse-delta-parser";
import { createStreamMessageUpdater } from "@/lib/stream-message-updater";
import { saveChatHistory, deleteChat } from "@/lib/actions/chat";

export function useChat(modelId: string, config?: { initialChatId?: string | null, initialMessages?: Message[] }) {
  const [chatId, setChatId] = useState<string | null>(config?.initialChatId || null);
  const [messages, setMessages] = useState<Message[]>(config?.initialMessages || []);
  const [isLoading, setIsLoading] = useState(false);
  const [isLimitReached, setIsLimitReached] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const abortRef = useRef<AbortController | null>(null);
  const isInitialLoad = useRef(true);
  const supabase = createClient();

  // Check auth status
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsLoggedIn(!!user);
      setUser(user);
    };
    checkUser();
  }, [supabase]);

  // Load from localStorage only if no initial messages and no chatId
  useEffect(() => {
    if (config?.initialChatId) return;

    const saved = localStorage.getItem("nusa_ai_chat_history");
    if (saved && messages.length === 0) {
      try {
        const parsed = JSON.parse(saved);
        const formatted = parsed.map((m: any) => ({
          ...m,
          createdAt: m.createdAt ? new Date(m.createdAt) : undefined
        }));
        setMessages(formatted);
        
        if (!isLoggedIn) {
          const userMessages = formatted.filter((m: any) => m.role === "user").length;
          if (userMessages >= 5) setIsLimitReached(true);
        }
      } catch (e) {
        console.error("Failed to parse chat history", e);
      }
    }
  }, [isLoggedIn, config?.initialChatId]);

  // Save to localStorage or DB on change
  useEffect(() => {
    if (messages.length > 0) {
      if (!isLoggedIn) {
        localStorage.setItem("nusa_ai_chat_history", JSON.stringify(messages));
        const userMessages = messages.filter((m) => m.role === "user").length;
        setIsLimitReached(userMessages >= 5);
      } else {
        setIsLimitReached(false);
        
        // Sync to backend if not loading
        // Skip the very first sync if we're loading an existing chat
        if (!isLoading) {
          if (isInitialLoad.current && config?.initialChatId) {
            isInitialLoad.current = false;
            return;
          }
          
          saveChatHistory(chatId, "Chat Baru", messages).then((res) => {
            if (res.success && res.chatId && !chatId) {
              setChatId(res.chatId);
              window.dispatchEvent(new CustomEvent("chat-updated"));
            }
          });
        }
      }
    }
  }, [messages, isLoggedIn, isLoading, chatId, config?.initialChatId]);

  const stop = useCallback(() => {
    abortRef.current?.abort();
    setIsLoading(false);
  }, []);

  const triggerChat = async (newMessages: Message[]) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: abortRef.current?.signal,
        body: JSON.stringify({
          messages: newMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          modelId,
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error(`HTTP ${response.status}`);
      }

      const assistantId = generateId();
      setMessages((prev) => [
        ...prev,
        { id: assistantId, role: "assistant", content: "", createdAt: new Date() },
      ]);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      const sse = createSseDeltaParser();
      const stream = createStreamMessageUpdater(setMessages, assistantId);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const deltas = sse.push(chunk);
        for (const d of deltas) {
          stream.pushDelta(d);
        }
      }
      for (const d of sse.end()) {
        stream.pushDelta(d);
      }
      stream.finish();
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;
      
      let errorMessage = "Maaf, terjadi kesalahan koneksi. Silakan coba lagi.";
      if (err instanceof Error && err.message.includes("429")) {
        errorMessage = "Server sedang sibuk (rate limit). Mohon tunggu beberapa detik sebelum mencoba lagi.";
      }
      
      setMessages((prev) => [
        ...prev,
        {
          id: generateId(),
          role: "assistant",
          content: errorMessage,
          createdAt: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const send = useCallback(
    async (content: string) => {
      if (isLoading || isLimitReached) return;

      abortRef.current?.abort();
      abortRef.current = new AbortController();

      const userMsg: Message = {
        id: generateId(),
        role: "user",
        content,
        createdAt: new Date(),
      };

      const newMessages = [...messages, userMsg];
      setMessages(newMessages);

      if (isLoggedIn) {
        saveChatHistory(chatId, "Chat Baru", newMessages).then((res) => {
          if (res.success && res.chatId && !chatId) {
            setChatId(res.chatId);
          }
        });
      }

      await triggerChat(newMessages);
    },
    [messages, modelId, isLoading, isLimitReached, isLoggedIn, chatId]
  );

  const editMessage = useCallback(
    async (messageId: string, newContent: string) => {
      if (isLoading) return;
      abortRef.current?.abort();
      abortRef.current = new AbortController();

      const index = messages.findIndex(m => m.id === messageId);
      if (index === -1) return;

      // Slice array up to the edited message, replace content
      const newMessages = messages.slice(0, index + 1);
      newMessages[index] = { ...newMessages[index], content: newContent };
      setMessages(newMessages);
      
      if (newMessages[index].role === "user") {
        await triggerChat(newMessages);
      }
    },
    [messages, modelId, isLoading]
  );

  const regenerate = useCallback(
    async (messageId?: string) => {
      if (isLoading) return;
      abortRef.current?.abort();
      abortRef.current = new AbortController();

      let targetIndex = messages.length - 1;
      if (messageId) {
        targetIndex = messages.findIndex(m => m.id === messageId);
        // If the target is a user message, we regenerate its response
        // Wait, if it's an assistant message, we regenerate it using all messages before it
        if (messages[targetIndex]?.role === "assistant") {
          targetIndex = targetIndex - 1;
        }
      } else {
        if (messages[targetIndex]?.role === "assistant") {
          targetIndex = targetIndex - 1;
        }
      }

      if (targetIndex < 0) return;

      const newMessages = messages.slice(0, targetIndex + 1);
      setMessages(newMessages);
      await triggerChat(newMessages);
    },
    [messages, modelId, isLoading]
  );

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setMessages([]);
    setChatId(null);
    localStorage.removeItem("nusa_ai_chat_history");
    setIsLimitReached(false);
    setIsLoading(false);
  }, []);

  const removeChat = useCallback(async () => {
    if (chatId) {
      await deleteChat(chatId);
      window.dispatchEvent(new CustomEvent("chat-updated"));
    }
    reset();
  }, [chatId, reset]);

  return { 
    messages, 
    setMessages,
    isLoading, 
    isLimitReached, 
    isLoggedIn, 
    user,
    chatId, 
    setChatId,
    send, 
    stop, 
    reset,
    removeChat,
    editMessage, 
    regenerate 
  };
}
