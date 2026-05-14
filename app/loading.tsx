"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function GlobalLoading() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center gap-6"
      >
        <motion.div
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="relative"
        >
          <div className="absolute inset-[-20px] rounded-[2rem] bg-brand-red/10 blur-2xl" aria-hidden />
          <div className="relative flex h-24 w-24 items-center justify-center rounded-[1.75rem] border border-zinc-100 bg-white shadow-lg shadow-zinc-200/60 ring-4 ring-zinc-50">
            <Image
              src="/logo.svg"
              alt="NusaAI"
              width={72}
              height={72}
              className="object-contain rounded-2xl"
              priority
            />
          </div>
        </motion.div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
          Memuat
        </p>
      </motion.div>
    </div>
  );
}
