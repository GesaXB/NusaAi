"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, FileText } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { HeroChatPreview } from "@/components/landing/hero-chat-preview";

const LOGOS = [
  "TUTOR.ID", "RUANGGURU", "ZENIUS", "QUIPPER", "PAHAMIFY", "EDUKASI", "NUSA"
];

const spring = { stiffness: 50, damping: 20, mass: 0.5 };

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Smooth spring-based parallax
  const rawBgY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const rawTextY = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const rawMockupY = useTransform(scrollYProgress, [0, 1], [0, 70]);
  const rawScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.96]);
  const rawOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const rawFloat1 = useTransform(scrollYProgress, [0, 1], [0, -30]);
  const rawFloat2 = useTransform(scrollYProgress, [0, 1], [0, 50]);

  const bgY = useSpring(rawBgY, spring);
  const textY = useSpring(rawTextY, spring);
  const mockupY = useSpring(rawMockupY, spring);
  const mockupScale = useSpring(rawScale, spring);
  const opacity = useSpring(rawOpacity, spring);
  const float1Y = useSpring(rawFloat1, spring);
  const float2Y = useSpring(rawFloat2, spring);

  return (
    <section ref={sectionRef} className="relative pt-32 pb-20 overflow-hidden bg-white">
      {/* Background Decor */}
      <motion.div
        style={{ y: bgY }}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-30 pointer-events-none"
      >
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-red/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] right-[-10%] w-[30%] h-[30%] bg-brand-red/5 blur-[100px] rounded-full" />
      </motion.div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Text — drifts up */}
        <motion.div style={{ y: textY, opacity }} className="flex flex-col items-center text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-50 border border-zinc-100 text-zinc-500 text-xs font-semibold mb-8"
          >
            Platform Belajar AI #1 di Indonesia
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black text-zinc-900 leading-[0.9] tracking-tighter mb-8 max-w-4xl"
          >
            Belajar <span className="text-brand-red italic">4x Lebih Cepat</span> Dengan AI.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-zinc-500 max-w-2xl leading-relaxed mb-10"
          >
            Dari konsep sulit hingga ringkasan PDF — NusaAI membantu ribuan pelajar Indonesia menguasai materi secara instan.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link href="/demo">
              <Button className="h-14 px-8 rounded-2xl text-base font-bold gap-2 shadow-xl shadow-brand-red/20 active:scale-95 transition-all">
                Mulai Belajar Gratis
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Button variant="outline" className="h-14 px-8 rounded-2xl text-base font-bold gap-2 border-zinc-200 hover:bg-zinc-50 transition-all">
              <Play className="w-4 h-4 fill-current" />
              Lihat Demo
            </Button>
          </motion.div>
        </motion.div>

        {/* Mockup — sinks down */}
        <motion.div
          style={{ y: mockupY, scale: mockupScale }}
          className="relative max-w-5xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="relative z-10 rounded-[2.5rem] border-[8px] border-zinc-50 shadow-2xl shadow-zinc-200/50 overflow-hidden bg-white">
                <HeroChatPreview />
              </div>
          </motion.div>

          {/* Floating 1: Chat Bubble — scroll wrapper + idle bob */}
          <motion.div style={{ y: float1Y }} className="absolute -top-12 -left-12 z-20 hidden lg:block">
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="bg-white p-4 rounded-3xl shadow-xl shadow-zinc-200/50 border border-zinc-100 w-64"
            >
              <div className="flex items-center gap-3 mb-2">
                <Image src="/logo.png" alt="NusaAI" width={28} height={28} className="rounded-lg" />
                <span className="font-bold text-xs">NusaAI Assistant</span>
              </div>
              <p className="text-[11px] text-zinc-500 leading-relaxed">
                &quot;Integral adalah kebalikan dari turunan. Bayangkan kita menjumlahkan area...&quot;
              </p>
            </motion.div>
          </motion.div>

          {/* Floating 2: Stats — scroll wrapper + idle bob */}
          <motion.div style={{ y: float2Y }} className="absolute top-20 -right-8 z-20 hidden lg:block">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="bg-white p-5 rounded-3xl shadow-xl shadow-zinc-200/50 border border-zinc-100"
            >
              <div className="text-center">
                <p className="text-3xl font-black text-brand-red">98%</p>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">Akurasi Materi</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Floating 3: PDF Badge — scroll wrapper + idle drift */}
          <motion.div style={{ y: float1Y }} className="absolute bottom-12 -left-8 z-20 hidden lg:block">
            <motion.div
              animate={{ x: [0, 8, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="bg-zinc-900 p-4 rounded-2xl shadow-xl text-white flex items-center gap-3"
            >
              <FileText className="w-5 h-5 text-brand-red" />
              <div className="pr-4">
                <p className="text-[10px] font-bold opacity-60 uppercase">Ringkasan PDF</p>
                <p className="text-xs font-bold">Biologi_Bab_3.pdf</p>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Logos */}
        <div className="mt-32 border-t border-zinc-100 pt-16">
          <p className="text-center text-xs font-bold text-zinc-400 uppercase tracking-[0.2em] mb-10">
            DIPERCAYA OLEH PELAJAR DARI
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 opacity-30 grayscale">
            {LOGOS.map((logo) => (
              <span key={logo} className="text-xl font-black tracking-tighter text-zinc-900">{logo}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
