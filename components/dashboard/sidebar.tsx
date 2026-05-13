"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
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

export function Sidebar({ chats = [], onNewChat, onLogout }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex flex-col h-full min-h-0 bg-white border-r border-zinc-100 transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 py-5 border-b border-zinc-100">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <Image
            src="/logo.png"
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
            "ml-auto p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-all",
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

            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={isNew ? onNewChat : undefined}
                className={cn(
                  "flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 group",
                  isActive
                    ? "bg-brand-red/5 text-brand-red font-medium"
                    : isNew
                    ? "bg-zinc-900 text-white hover:bg-zinc-800 font-medium shadow-lg shadow-zinc-200/50"
                    : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
                )}
              >
                <Icon className={cn("w-4 h-4 flex-shrink-0", isNew && "text-white")} />
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
