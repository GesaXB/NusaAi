"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const validate = () => {
    if (password.length < 8) return "Password minimal 8 karakter.";
    if (/["<>{} ]/.test(password)) return "Password tidak boleh mengandung karakter: \" < > { }";
    if (password !== confirmPw) return "Password tidak cocok.";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const err = validate();
    if (err) {
      setError(err);
      return;
    }

    setLoading(true);
    const { error: upErr } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (upErr) {
      setError(upErr.message);
    } else {
      setSuccess(true);
      setTimeout(() => router.push("/dashboard"), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col items-center justify-center px-4 py-12">
      <Toast
        open={success}
        message="Password berhasil diubah. Mengalihkan…"
        variant="success"
        onClose={() => setSuccess(false)}
      />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-[420px]"
      >
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-8 sm:p-9 shadow-[0_20px_50px_-24px_rgba(0,0,0,0.12)]">
          <div className="mb-8 text-center">
            <Link href="/" className="inline-flex items-center justify-center gap-2.5">
              <Image src="/logo.svg" alt="NusaAI" width={32} height={32} className="rounded-lg" />
              <span className="text-lg font-bold tracking-tight text-zinc-900">
                Nusa<span className="text-brand-red">AI</span>
              </span>
            </Link>
          </div>

          <div className="mb-6 flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-50 ring-1 ring-zinc-100">
              <Lock className="h-7 w-7 text-brand-red" strokeWidth={1.75} />
            </div>
          </div>

          <h1 className="text-center text-xl font-bold tracking-tight text-zinc-900 sm:text-2xl">Password baru</h1>
          <p className="mt-2 text-center text-sm leading-relaxed text-zinc-500">
            Lewat tautan reset email. Buat password baru untuk melanjutkan.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-700">Password baru</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 8 karakter"
                  className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none transition-all focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/5"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700"
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-700">Konfirmasi password</label>
              <input
                type={showPw ? "text" : "password"}
                value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)}
                placeholder="Ulangi password"
                className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none transition-all focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/5"
              />
            </div>

            {error && (
              <p className="rounded-xl border border-red-100 bg-red-50/90 px-4 py-3 text-xs font-medium text-red-600">{error}</p>
            )}

            <Button type="submit" className="h-11 w-full gap-2 rounded-xl bg-zinc-900 hover:bg-zinc-800" loading={loading}>
              Simpan password <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-zinc-500">
            <Link href="/login" className="font-semibold text-brand-red hover:text-brand-red-dark transition-colors">
              Kembali ke login
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
