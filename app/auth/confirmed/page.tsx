"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight } from "lucide-react";

export default function ConfirmedPage() {
  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="bg-white rounded-3xl shadow-xl border border-zinc-100 p-10 max-w-md w-full text-center space-y-6"
      >
        <div className="flex justify-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.2 }}
            className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center"
          >
            <CheckCircle2 className="w-8 h-8 text-emerald-500" />
          </motion.div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-zinc-900">Email Terkonfirmasi!</h1>
          <p className="text-sm text-zinc-500 leading-relaxed">
            Akun kamu telah berhasil diverifikasi. Sekarang kamu bisa masuk dan menikmati semua fitur NusaAI tanpa batas.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 py-4 px-4 bg-zinc-50 rounded-2xl border border-zinc-100">
          <Image src="/logo.png" alt="NusaAI" width={28} height={28} className="rounded-lg" />
          <span className="font-bold text-zinc-900 tracking-tight">
            Nusa<span className="text-brand-red">AI</span>
          </span>
        </div>

        <Link
          href="/login"
          className="w-full flex items-center justify-center gap-2 bg-zinc-900 text-white py-3.5 rounded-xl font-bold text-sm hover:bg-zinc-800 transition-all active:scale-95 group"
        >
          Masuk ke NusaAI
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>

        <p className="text-[11px] text-zinc-400">
          Jika kamu tidak merasa mendaftar, abaikan halaman ini.
        </p>
      </motion.div>
    </div>
  );
}
