"use client";

import { ModelSelector } from "@/components/dashboard/model-selector";
import { Bell, Search, LogOut } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface TopbarProps {
  modelId: string;
  onModelChange: (id: string) => void;
  userAvatar?: string | null;
  userName?: string | null;
}

export function Topbar({ modelId, onModelChange, userAvatar, userName }: TopbarProps) {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <header className="flex items-center justify-between px-6 py-3.5 border-b border-zinc-100 bg-white/80 backdrop-blur-md sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5">
          <Image src="/logo.png" alt="NusaAI" width={22} height={22} className="rounded-lg shadow-sm" />
          <span className="text-sm font-bold text-zinc-900 tracking-tight">Nusa<span className="text-brand-red">AI</span></span>
        </div>
        
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-50 border border-zinc-100 text-zinc-400 focus-within:border-zinc-200 transition-all">
          <Search className="w-3.5 h-3.5" />
          <input 
            type="text" 
            placeholder="Cari materi..." 
            className="bg-transparent text-xs outline-none w-48 text-zinc-900 placeholder:text-zinc-400"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <ModelSelector value={modelId} onChange={onModelChange} />

        <div className="flex items-center gap-1.5 border-l border-zinc-100 pl-4">
          <button className="relative p-2 rounded-xl text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50 transition-all group">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-brand-red rounded-full ring-2 ring-white" />
          </button>

          <div className="flex items-center gap-3 pl-2">
            <div className="w-9 h-9 rounded-full bg-zinc-50 border border-zinc-100 flex items-center justify-center text-xs font-bold text-zinc-700 overflow-hidden shadow-inner">
              {userAvatar ? (
                <img src={userAvatar} alt={userName ?? "User"} className="w-full h-full object-cover" />
              ) : (
                (userName?.[0] ?? "U").toUpperCase()
              )}
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-xs font-bold text-zinc-900 leading-none mb-1">{userName ?? "Pengguna"}</span>
              <span className="text-[10px] font-medium text-zinc-400 leading-none">Free Plan</span>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            title="Keluar"
            className="ml-1 p-2 rounded-xl text-zinc-400 hover:text-red-500 hover:bg-red-50 transition-all"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
