"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Toast } from "@/components/ui/toast";

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
    if (err) { setError(err); return; }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
      setTimeout(() => router.push("/dashboard"), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center px-4">
      <Toast open={success} message="Password berhasil diubah! Mengalihkan..." variant="success" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-xl border border-zinc-100 p-10 max-w-md w-full space-y-6"
      >
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <div className="w-14 h-14 rounded-2xl bg-zinc-900 flex items-center justify-center">
              <Lock className="w-6 h-6 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-zinc-900">Atur Password Baru</h1>
          <p className="text-sm text-zinc-500">Buat password baru untuk akun NusaAI kamu.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-700">Password Baru</label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Minimal 8 karakter"
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-sm focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/5 outline-none transition-all"
              />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700">
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-700">Konfirmasi Password</label>
            <input
              type={showPw ? "text" : "password"}
              value={confirmPw}
              onChange={e => setConfirmPw(e.target.value)}
              placeholder="Ulangi password baru"
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-sm focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/5 outline-none transition-all"
            />
          </div>

          {error && (
            <p className="text-xs font-semibold text-red-500 bg-red-50 px-4 py-2 rounded-xl">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-zinc-900 text-white font-bold text-sm hover:bg-zinc-800 transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? "Menyimpan..." : "Simpan Password Baru"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
