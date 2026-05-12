"use client";

import { useState } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";
import { AI_MODELS } from "@/types";
import { User, Bell, Shield, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const SECTIONS = [
  { icon: User, label: "Profil", id: "profile" },
  { icon: Bell, label: "Notifikasi", id: "notifications" },
  { icon: Palette, label: "Tampilan", id: "appearance" },
  { icon: Shield, label: "Keamanan", id: "security" },
];

export default function SettingsPage() {
  const [modelId, setModelId] = useState(AI_MODELS[0].id);
  const [active, setActive] = useState("profile");
  const [name, setName] = useState("Pengguna NusaAI");
  const [email] = useState("user@example.com");

  return (
    <div className="flex h-screen bg-zinc-50 overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <Topbar modelId={modelId} onModelChange={setModelId} userName={name} />

        <div className="flex-1 overflow-y-auto p-6 bg-zinc-50">
          <div className="max-w-3xl mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-zinc-900 mb-1">Pengaturan</h1>
              <p className="text-zinc-500 text-sm">Kelola akun dan preferensi kamu.</p>
            </div>

            <div className="flex gap-6">
              {/* Settings nav */}
              <div className="w-44 flex-shrink-0">
                <nav className="flex flex-col gap-1">
                  {SECTIONS.map((s) => {
                    const Icon = s.icon;
                    return (
                      <button
                        key={s.id}
                        onClick={() => setActive(s.id)}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-left transition-all ${
                          active === s.id
                            ? "bg-brand-red/5 text-brand-red font-medium"
                            : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100"
                        }`}
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
                {active === "profile" && (
                  <div className="bg-white border border-zinc-100 rounded-2xl p-6 space-y-5">
                    <h2 className="font-semibold text-zinc-900">Profil Saya</h2>

                    {/* Avatar */}
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-brand-red flex items-center justify-center text-xl font-bold text-white">
                        {name[0]?.toUpperCase()}
                      </div>
                      <Button variant="outline" size="sm">Ganti Foto</Button>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-zinc-700 block mb-1.5">Nama</label>
                        <Input
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Nama kamu"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-zinc-700 block mb-1.5">Email</label>
                        <Input value={email} disabled className="opacity-60" />
                      </div>
                    </div>

                    <Button className="w-full sm:w-auto">Simpan Perubahan</Button>
                  </div>
                )}

                {active !== "profile" && (
                  <div className="bg-white border border-zinc-100 rounded-2xl p-6">
                    <h2 className="font-semibold text-zinc-900 mb-4">
                      {SECTIONS.find((s) => s.id === active)?.label}
                    </h2>
                    <p className="text-sm text-zinc-500">Fitur ini akan segera hadir.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
