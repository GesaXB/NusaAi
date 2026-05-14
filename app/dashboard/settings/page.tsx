"use client";

import { useState } from "react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { User, Bell, Shield, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const SECTIONS = [
  { icon: User, label: "Profil", id: "profile" },
  { icon: Bell, label: "Notifikasi", id: "notifications" },
  { icon: Palette, label: "Tampilan", id: "appearance" },
  { icon: Shield, label: "Keamanan", id: "security" },
];

export default function SettingsPage() {
  const [active, setActive] = useState("profile");

  return (
    <DashboardShell>
      {({ user }) => (
        <div className="h-full overflow-y-auto p-4 sm:p-6 lg:p-10 bg-zinc-50/50">
          <div className="max-w-3xl mx-auto">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-zinc-900 mb-1 tracking-tight">Pengaturan</h1>
              <p className="text-zinc-500 text-sm">Kelola akun dan preferensi kamu.</p>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
              {/* Settings nav */}
              <div className="w-full md:w-56 shrink-0">
                <nav className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible pb-2 md:pb-0 scrollbar-hide">
                  {SECTIONS.map((s) => {
                    const Icon = s.icon;
                    return (
                      <button
                        key={s.id}
                        onClick={() => setActive(s.id)}
                        className={cn(
                          "flex items-center gap-2.5 px-4 py-3 rounded-2xl text-sm text-left transition-all whitespace-nowrap",
                          active === s.id
                            ? "bg-brand-red text-white font-bold shadow-lg shadow-brand-red/20"
                            : "text-zinc-500 hover:text-zinc-900 hover:bg-white"
                        )}
                      >
                        <Icon className="w-4 h-4" />
                        {s.label}
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Settings content */}
              <div className="flex-1 min-w-0">
                <div className="bg-white border border-zinc-100 rounded-3xl p-6 sm:p-8 shadow-sm">
                  {active === "profile" ? (
                    <div className="space-y-8">
                      <div className="flex items-center gap-6">
                        <div className="w-20 h-20 rounded-3xl bg-zinc-50 border border-zinc-100 flex items-center justify-center overflow-hidden shadow-inner">
                          {user?.user_metadata?.avatar_url ? (
                            <img src={user.user_metadata.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-2xl font-bold text-zinc-400">
                              {(user?.user_metadata?.full_name?.[0] || user?.email?.[0] || "U").toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Button variant="outline" size="sm" className="rounded-xl font-bold">Ganti Foto</Button>
                          <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">Maks 2MB</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">Nama Lengkap</label>
                          <Input
                            defaultValue={user?.user_metadata?.full_name || ""}
                            placeholder="Masukkan nama"
                            className="h-12 rounded-xl bg-zinc-50 border-transparent focus:bg-white focus:border-zinc-200 transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">Alamat Email</label>
                          <Input 
                            value={user?.email || ""} 
                            disabled 
                            className="h-12 rounded-xl bg-zinc-50 border-transparent opacity-60 cursor-not-allowed" 
                          />
                        </div>
                      </div>

                      <div className="pt-4">
                        <Button className="w-full sm:w-auto px-10 h-12 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold shadow-xl shadow-zinc-200 transition-all">
                          Simpan Perubahan
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="py-12 text-center">
                      <div className="w-16 h-16 bg-zinc-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Icon className="w-8 h-8 text-zinc-300" />
                      </div>
                      <h3 className="font-bold text-zinc-900 mb-1">
                        {SECTIONS.find((s) => s.id === active)?.label}
                      </h3>
                      <p className="text-sm text-zinc-500">Fitur ini akan segera hadir.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}

function Icon({ className }: { className?: string }) {
  return <div className={className} />;
}
