"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Sparkles, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-brand-red/5 rounded-2xl flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-brand-red" />
          </div>
        </div>
        
        <h1 className="text-8xl font-black text-zinc-900 mb-4 tracking-tighter">404</h1>
        <h2 className="text-2xl font-bold text-zinc-800 mb-4">Halaman Tidak Ditemukan</h2>
        <p className="text-zinc-500 mb-10 leading-relaxed">
          Sepertinya halaman yang kamu cari sudah pindah atau tidak pernah ada. 
          Tapi jangan khawatir, AI kami masih di sini untuk membantumu belajar.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/">
            <Button className="w-full sm:w-auto px-8 gap-2">
              <Home className="w-4 h-4" />
              Kembali ke Beranda
            </Button>
          </Link>
          <Button 
            variant="outline" 
            className="w-full sm:w-auto px-8 gap-2"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </Button>
        </div>
      </motion.div>
      
      <div className="mt-20 pt-10 border-t border-zinc-100 w-full max-w-sm text-center">
        <p className="text-xs text-zinc-400 font-medium tracking-widest uppercase">
          NusaAI — Belajar Lebih Cerdas
        </p>
      </div>
    </div>
  );
}
