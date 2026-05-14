"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { getRecentChats } from "@/lib/actions/chat";
import { createClient } from "@/lib/supabase/client";
import {
  MessageSquare,
  History,
  FileUp,
  Settings,
  ChevronLeft,
  Plus,
  LogOut,
  Newspaper,
  Shield,
} from "lucide-react";
import type { Chat } from "@/types";

interface SidebarProps {
  chats?: Chat[];
  onNewChat?: () => void;
  onLogout?: () => void;
}

const NAV_ITEMS = [
  { icon: Plus, label: "Chat Baru", href: "/dashboard", action: "new" },
  { icon: History, label: "Riwayat", href: "/dashboard/history" },
  { icon: FileUp, label: "Upload PDF", href: "/dashboard/upload" },
  { icon: Newspaper, label: "Blog", href: "/blog" },
  { icon: Shield, label: "Admin Blog", href: "/dashboard/admin/blog" },
  { icon: Settings, label: "Pengaturan", href: "/dashboard/settings" },
];

export function Sidebar({ chats: initialChats = [], onNewChat, onLogout }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [chats, setChats] = useState<Chat[]>(initialChats);
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    if (initialChats.length > 0) {
      setChats(initialChats);
    }
  }, [initialChats]);

  useEffect(() => {
    const fetchRecent = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const data = await getRecentChats();
        setChats(data as Chat[]);
      }
    };

    const handleSync = () => {
      fetchRecent();
    };

    window.addEventListener("chat-updated", handleSync);

    // If we're in dashboard and don't have chats or if the pathname changes
    if (pathname.startsWith("/dashboard")) {
      fetchRecent();
    }

    return () => {
      window.removeEventListener("chat-updated", handleSync);
    };
  }, [pathname, supabase.auth]);

  return (
    <aside
      className={cn(
        "flex flex-col h-full bg-white border-r border-zinc-100 transition-all duration-300 ease-in-out z-50",
        collapsed ? "w-16" : "w-full md:w-64"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 py-5 border-b border-zinc-100">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <Image
            src="/logo.svg"
            alt="NusaAI"
            width={collapsed ? 28 : 24}
            height={collapsed ? 28 : 24}
            className="rounded-lg"
          />
          {!collapsed && (
            <span className="font-bold text-zinc-900 text-sm tracking-tight">
              Nusa<span className="text-brand-red">AI</span>
            </span>
          )}
        </Link>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "ml-auto p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-all hidden md:block",
            collapsed && "rotate-180"
          )}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto overscroll-y-contain [-webkit-overflow-scrolling:touch]">
        <nav className="flex flex-col gap-1 p-2">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            const isNew = item.action === "new";

            if (isNew) {
              return (
                <button
                  key={item.label}
                  onClick={onNewChat}
                  className={cn(
                    "flex items-center gap-3 px-3.5 py-3 rounded-2xl text-[15px] md:text-sm transition-all duration-200 group bg-zinc-900 text-white hover:bg-zinc-800 font-bold shadow-lg shadow-zinc-200/50 w-full"
                  )}
                >
                  <Icon className="w-4 h-4 flex-shrink-0 text-white" />
                  {!collapsed && <span>{item.label}</span>}
                </button>
              );
            }

            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3.5 py-3 rounded-2xl text-[15px] md:text-sm transition-all duration-200 group",
                  isActive
                    ? "bg-brand-red/5 text-brand-red font-bold"
                    : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 font-medium"
                )}
              >
                <Icon className={cn("w-4 h-4 flex-shrink-0")} />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Recent chats */}
        {!collapsed && chats.length > 0 && (
          <div className="px-2 py-2 pb-4">
            <p className="text-[10px] text-zinc-400 px-3 mb-2 uppercase tracking-widest font-semibold">
              Terbaru
            </p>
            <div className="flex flex-col gap-0.5">
              {chats.slice(0, 8).map((chat) => (
                <Link
                  key={chat.id}
                  href={`/dashboard/chat/${chat.id}`}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 transition-all truncate"
                >
                  <MessageSquare className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate">{chat.title}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom logout */}
      <div className="p-2 border-t border-zinc-100 mt-auto">
        <button
          onClick={onLogout}
          className="flex items-center gap-2.5 px-3 py-2.5 w-full rounded-xl text-sm text-zinc-400 hover:text-red-500 hover:bg-red-50 transition-all"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span>Keluar</span>}
        </button>
      </div>
    </aside>
  );
}
