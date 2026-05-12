"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion, AnimatePresence } from "framer-motion";
import type { Message } from "@/types";

interface MessageBubbleProps {
  message: Message;
  isStreaming?: boolean;
}

export function MessageBubble({ message, isStreaming }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn(
        "flex gap-4 group w-full",
        isUser && "flex-row-reverse"
      )}
    >
      {/* Avatar */}
      <div className="flex-shrink-0 mt-1">
        {isUser ? (
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-[9px] sm:text-[10px] font-black text-zinc-400 uppercase tracking-tighter">
            User
          </div>
        ) : (
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-white border border-zinc-100 flex items-center justify-center overflow-hidden shadow-sm ring-2 sm:ring-4 ring-zinc-50">
            <Image src="/logo.png" alt="NusaAI" width={16} height={16} />
          </div>
        )}
      </div>

      {/* Bubble */}
      <div
        className={cn(
          "max-w-[88%] sm:max-w-[75%] rounded-2xl px-4 sm:px-5 py-3 sm:py-3.5 text-[14px] sm:text-[15px] leading-relaxed transition-all duration-300",
          isUser
            ? "bg-zinc-900 text-white rounded-tr-sm shadow-xl shadow-zinc-200/30 font-medium"
            : "bg-white border border-zinc-100 text-zinc-700 rounded-tl-sm shadow-sm hover:shadow-md hover:border-zinc-200"
        )}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{message.content}</p>
        ) : (
          <div className="prose prose-sm prose-zinc max-w-none prose-p:leading-relaxed prose-pre:bg-zinc-50 prose-pre:border prose-pre:border-zinc-100 prose-strong:text-zinc-900 prose-headings:text-zinc-900">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.content}
            </ReactMarkdown>
            {isStreaming && (
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="inline-block w-1.5 h-4 bg-brand-red rounded-full ml-1 align-middle"
              />
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export function TypingIndicator() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-4"
    >
      <div className="w-8 h-8 rounded-xl bg-white border border-zinc-100 flex items-center justify-center flex-shrink-0 shadow-sm ring-4 ring-zinc-50">
        <Image src="/logo.png" alt="NusaAI" width={18} height={18} />
      </div>
      <div className="bg-white border border-zinc-100 rounded-2xl rounded-tl-sm px-6 py-4 shadow-sm flex items-center">
        <div className="flex gap-1.5 items-center">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ 
                y: [0, -4, 0],
                opacity: [0.3, 1, 0.3]
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.15,
                ease: "easeInOut"
              }}
              className="w-1.5 h-1.5 rounded-full bg-zinc-300"
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export function MessageSkeleton() {
  return (
    <div className="flex gap-4">
      <div className="w-8 h-8 rounded-xl bg-zinc-50 flex-shrink-0 animate-pulse" />
      <div className="flex flex-col gap-2.5 flex-1 max-w-md">
        <div className="bg-zinc-50 h-4 w-3/4 rounded-lg animate-pulse" />
        <div className="bg-zinc-50 h-4 w-full rounded-lg animate-pulse" />
        <div className="bg-zinc-50 h-4 w-1/2 rounded-lg animate-pulse" />
      </div>
    </div>
  );
}
