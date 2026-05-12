"use client";

import { useState } from "react";
import { ModelSelector } from "@/components/dashboard/model-selector";
import { Bell, Search, LogOut } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

interface TopbarProps {
  modelId: string;
  onModelChange: (id: string) => void;
  userAvatar?: string | null;
  userName?: string | null;
}

export function Topbar({ modelId, onModelChange, userAvatar, userName }: TopbarProps) {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    setShowLogoutConfirm(false);
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <>
      <ConfirmDialog
        open={showLogoutConfirm}
        title="Keluar dari NusaAI?"
        message="Kamu akan keluar dari akun. Semua sesi aktif akan dihentikan."
        confirmText="Ya, Keluar"
        cancelText="Batal"
        variant="danger"
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutConfirm(false)}
      />

      <header className="flex items-center justify-between px-3 sm:px-6 py-2.5 sm:py-3.5 border-b border-zinc-100 bg-white/80 backdrop-blur-md sticky top-0 z-30">
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="NusaAI" width={20} height={20} className="rounded-lg shadow-sm sm:w-[22px] sm:h-[22px]" />
            <span className="text-xs sm:text-sm font-bold text-zinc-900 tracking-tight">Nusa<span className="text-brand-red">AI</span></span>
          </div>
          
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-50 border border-zinc-100 text-zinc-400 focus-within:border-zinc-200 transition-all">
            <Search className="w-3.5 h-3.5" />
            <input type="text" placeholder="Cari materi..." className="bg-transparent text-xs outline-none w-48 text-zinc-900 placeholder:text-zinc-400" />
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden sm:block">
            <ModelSelector value={modelId} onChange={onModelChange} />
          </div>

          <div className="flex items-center gap-1 sm:gap-1.5 sm:border-l sm:border-zinc-100 sm:pl-4">
            <button className="relative p-1.5 sm:p-2 rounded-xl text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50 transition-all group hidden sm:block">
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 w-1.5 h-1.5 bg-brand-red rounded-full ring-2 ring-white" />
            </button>

            <div className="flex items-center gap-2 sm:gap-3 pl-1 sm:pl-2">
              <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-zinc-50 border border-zinc-100 flex items-center justify-center text-[10px] sm:text-xs font-bold text-zinc-700 overflow-hidden shadow-inner">
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

            <button
              onClick={() => setShowLogoutConfirm(true)}
              title="Keluar"
              className="ml-0.5 sm:ml-1 p-1.5 sm:p-2 rounded-xl text-zinc-400 hover:text-red-500 hover:bg-red-50 transition-all"
            >
              <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
