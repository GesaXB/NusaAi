"use client";

import { motion } from "framer-motion";
import {
  MessageSquare,
  FileText,
  Zap,
  Brain,
  Target,
  BarChart3,
} from "lucide-react";

const FEATURES = [
  {
    icon: MessageSquare,
    title: "AI Chat Cerdas",
    description:
      "Tanyakan apa saja — dari PR Matematika hingga konsep Fisika. AI kami merespons dengan bahasa yang mudah dipahami.",
  },
  {
    icon: FileText,
    title: "Analisis PDF Instan",
    description:
      "Upload materi PDF, dapatkan ringkasan bab-bab panjang menjadi poin penting dalam hitungan detik.",
  },
  {
    icon: Zap,
    title: "Quiz Generator",
    description:
      "Buat quiz otomatis dari materi kamu. Multiple choice, essay, dan fill-in-the-blank — semua tersedia.",
  },
  {
    icon: Brain,
    title: "Konteks Kurikulum Lokal",
    description:
      "Dilatih dengan kurikulum Indonesia. Setiap jawaban relevan dengan Kurikulum Merdeka dan standar nasional.",
  },
  {
    icon: Target,
    title: "Akurasi Tinggi",
    description:
      "Model AI yang dikalibrasi untuk konteks pendidikan Indonesia dengan tingkat akurasi hingga 98%.",
  },
  {
    icon: BarChart3,
    title: "Analisis Kemajuan",
    description:
      "Pantau progress belajar kamu secara real-time. Ketahui topik mana yang perlu diperkuat.",
  },
];

const STATS = [
  { value: "89%", label: "Peningkatan Nilai" },
  { value: "72%", label: "Waktu Belajar Hemat" },
  { value: "10rb+", label: "Pelajar Aktif" },
];

export function FeaturesSection() {
  return (
    <section id="features" className="scroll-mt-28 py-24 md:py-32 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="max-w-2xl mb-16">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-brand-red font-semibold text-sm tracking-wide mb-3"
          >
            Fitur
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="text-3xl md:text-[2.75rem] font-bold text-zinc-900 leading-[1.15] tracking-tight mb-5"
          >
            Semua yang kamu butuhkan untuk belajar lebih cerdas.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-zinc-500 leading-relaxed"
          >
            Dari chat AI hingga analisis PDF — tools yang dirancang khusus untuk membantu pelajar Indonesia.
          </motion.p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="group p-7 rounded-2xl border border-zinc-100 hover:border-zinc-200 bg-white hover:shadow-lg hover:shadow-zinc-100/60 transition-all duration-300"
            >
              <div className="w-11 h-11 rounded-xl bg-brand-red/5 flex items-center justify-center mb-5 group-hover:bg-brand-red/10 transition-colors">
                <feature.icon className="w-5 h-5 text-brand-red" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-zinc-500 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Stats Strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl bg-zinc-950 p-8 md:p-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-zinc-800">
            {STATS.map((stat, i) => (
              <div key={stat.label} className="flex flex-col items-center text-center py-6 md:py-0 md:px-8">
                <span className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-2">
                  {stat.value}
                </span>
                <span className="text-sm font-medium text-zinc-500">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
