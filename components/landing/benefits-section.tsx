"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { TrendingUp, Users, CheckCircle, Award } from "lucide-react";
import { useRef } from "react";

const STATS = [
  { 
    value: "12rb+", 
    label: "Pelajar Aktif", 
    description: "Siswa dari berbagai jenjang pendidikan di seluruh Indonesia.",
    icon: Users 
  },
  { 
    value: "98%", 
    label: "Akurasi Jawaban", 
    description: "Jawaban yang diverifikasi sesuai dengan standar kurikulum nasional.",
    icon: CheckCircle 
  },
  { 
    value: "50rb+", 
    label: "Materi Terbantu", 
    description: "Dokumen dan pertanyaan yang berhasil diselesaikan setiap bulan.",
    icon: Award 
  },
];

export function BenefitsSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <section ref={ref} className="py-32 bg-[#fcfcfc] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Text Side */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-6"
            >
              KEUNGGULAN KAMI
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-6xl font-black text-zinc-900 leading-tight tracking-tighter mb-8"
            >
              Mencapai Standar <br />
              <span className="text-brand-red italic">Edukasi Tertinggi.</span>
            </motion.h2>
            
            <div className="space-y-12 mt-12">
              {STATS.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-6 group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-white border border-zinc-100 shadow-sm flex items-center justify-center shrink-0 group-hover:border-brand-red/20 group-hover:shadow-lg group-hover:shadow-brand-red/5 transition-all duration-300">
                    <stat.icon className="w-6 h-6 text-brand-red" />
                  </div>
                  <div>
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-3xl font-black text-zinc-900 tracking-tighter">{stat.value}</span>
                    </div>
                    <h3 className="text-base font-bold text-zinc-900 mb-1">{stat.label}</h3>
                    <p className="text-sm text-zinc-500 leading-relaxed max-w-sm">
                      {stat.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Image Side - Collage/Bento Style */}
          <motion.div
            style={{ y: imgY }}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative rounded-[3rem] overflow-hidden aspect-[4/5] shadow-2xl shadow-zinc-200">
              <img 
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2670&auto=format&fit=crop" 
                alt="Students studying"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/40 to-transparent" />
            </div>

            {/* Overlay Card */}
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-8 -left-8 bg-white p-6 rounded-[2rem] shadow-xl border border-zinc-50 max-w-[240px]"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-emerald-500" />
                </div>
                <span className="font-bold text-sm">Growth Score</span>
              </div>
              <div className="space-y-3">
                <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                  <div className="h-full w-[85%] bg-emerald-500 rounded-full" />
                </div>
                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                  85% PROGRESS TERCAPAI
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
