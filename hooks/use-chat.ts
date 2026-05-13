"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import type { Message } from "@/types";
import { generateId } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { createSseDeltaParser } from "@/lib/sse-delta-parser";
import { createStreamMessageUpdater } from "@/lib/stream-message-updater";

export function useChat(modelId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLimitReached, setIsLimitReached] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const supabase = createClient();

  // Check auth status
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsLoggedIn(!!user);
    };
    checkUser();
  }, [supabase]);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("nusa_ai_chat_history");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const formatted = parsed.map((m: any) => ({
          ...m,
          createdAt: m.createdAt ? new Date(m.createdAt) : undefined
        }));
        setMessages(formatted);
        
        // Check limit if not logged in
        if (!isLoggedIn) {
          const userMessages = formatted.filter((m: any) => m.role === "user").length;
          if (userMessages >= 5) {
            setIsLimitReached(true);
          }
        }
      } catch (e) {
        console.error("Failed to parse chat history", e);
      }
    }
  }, [isLoggedIn]);

  // Save to localStorage on change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("nusa_ai_chat_history", JSON.stringify(messages));
      
      // Update limit status
      if (!isLoggedIn) {
        const userMessages = messages.filter((m) => m.role === "user").length;
        if (userMessages >= 5) {
          setIsLimitReached(true);
        } else {
          setIsLimitReached(false);
        }
      } else {
        setIsLimitReached(false);
      }
    }
  }, [messages, isLoggedIn]);

  const stop = useCallback(() => {
    abortRef.current?.abort();
    setIsLoading(false);
  }, []);

  const send = useCallback(
    async (content: string) => {
      if (isLoading || isLimitReached) return;

      // Abort any ongoing stream
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
      setIsLoading(true);

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: abortRef.current.signal,
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
        
        let errorMessage =
          "Maaf, terjadi kesalahan koneksi. Silakan coba lagi.";
        if (err instanceof Error && err.message.includes("429")) {
          errorMessage =
            "Server sedang sibuk (rate limit). Mohon tunggu beberapa detik sebelum mencoba lagi.";
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
    },
    [messages, modelId, isLoading, isLimitReached]
  );

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setMessages([]);
    localStorage.removeItem("nusa_ai_chat_history");
    setIsLimitReached(false);
    setIsLoading(false);
  }, []);

  return { messages, isLoading, isLimitReached, isLoggedIn, send, stop, reset };
}
