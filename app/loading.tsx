"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function GlobalLoading() {
  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-[100] px-6">
      {/* Background Decor */}
      <div className="absolute inset-0 -z-10 opacity-30 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-red/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] right-[-10%] w-[30%] h-[30%] bg-brand-red/5 blur-[100px] rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center"
      >
        <div className="relative mb-12">
          {/* Pulsing Glow */}
          <motion.div
            animate={{ 
              scale: [1, 1.4, 1],
              opacity: [0.3, 0.6, 0.3] 
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-0 bg-brand-red/20 blur-2xl rounded-full"
          />
          
          <div className="relative w-20 h-20 rounded-3xl bg-zinc-900 flex items-center justify-center shadow-2xl shadow-zinc-200">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-8 h-8 text-white" />
            </motion.div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 120 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="h-1 bg-brand-red rounded-full overflow-hidden"
          />
          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] mt-4">
            Memuat NusaAI
          </p>
        </div>
      </motion.div>
    </div>
  );
}
