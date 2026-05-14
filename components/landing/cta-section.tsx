"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Camera, Send, Globe, GitBranch, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const FOOTER_LINKS = [
  {
    title: "Produk",
    links: [
      { label: "Fitur Utama", href: "#features" },
      { label: "Demo Platform", href: "#demo" },
      { label: "Blog Edukasi", href: "/blog" },
      { label: "Update Terbaru", href: "/blog" },
    ],
  },
  {
    title: "Perusahaan",
    links: [
      { label: "Tentang Kami", href: "#" },
      { label: "Karir", href: "#" },
      { label: "Hubungi Kami", href: "#" },
      { label: "Legal", href: "#" },
    ],
  },
  {
    title: "Bantuan",
    links: [
      { label: "Pusat Bantuan", href: "#" },
      { label: "Komunitas", href: "#" },
      { label: "Tutorial", href: "#" },
      { label: "Status Sistem", href: "#" },
    ],
  },
];

export function CTASection() {
  return (
    <footer className="bg-white border-t border-zinc-50 pt-32 pb-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Main CTA */}
        <div className="bg-zinc-900 rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden mb-32">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-brand-red/20 via-transparent to-transparent opacity-50" />
          
          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[10px] font-black text-white/60 uppercase tracking-widest mb-8"
            >
              READY TO LEVEL UP?
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-7xl font-black text-white tracking-tighter leading-[0.9] mb-10 max-w-3xl mx-auto"
            >
              Siap Menguasai <br /> Materi <span className="text-brand-red italic">Hari Ini?</span>
            </motion.h2>
            <p className="text-zinc-400 text-lg md:text-xl max-w-xl mx-auto mb-12">
              Bergabunglah dengan ribuan pelajar lainnya dan rasakan revolusi belajar berbasis AI.
            </p>
            <Link href="/demo">
              <Button className="h-16 px-10 rounded-2xl bg-white text-zinc-900 hover:bg-zinc-100 font-bold text-lg gap-3 shadow-2xl shadow-white/10 transition-all active:scale-95">
                Mulai Belajar Sekarang
                <ArrowRight className="w-6 h-6" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Footer Links */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-12 md:gap-8 mb-24">
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-8">
              <Image src="/logo.svg" alt="NusaAI" width={32} height={32} className="rounded-lg" />
              <span className="font-bold text-xl text-zinc-900 tracking-tight">Nusa<span className="text-brand-red">AI</span></span>
            </Link>
            <p className="text-zinc-500 text-sm leading-relaxed max-w-xs mb-8">
              Membangun masa depan pendidikan Indonesia dengan teknologi AI kelas dunia.
            </p>
            <div className="flex items-center gap-4">
              {[Camera, Send, Globe, GitBranch].map((Icon, i) => (
                <Link 
                  key={i} 
                  href="#" 
                  className="w-10 h-10 rounded-xl border border-zinc-100 flex items-center justify-center text-zinc-400 hover:text-brand-red hover:border-brand-red/20 hover:bg-brand-red/5 transition-all"
                >
                  <Icon className="w-5 h-5" />
                </Link>
              ))}
            </div>
          </div>

          {FOOTER_LINKS.map((group) => (
            <div key={group.title}>
              <h4 className="font-black text-xs text-zinc-900 uppercase tracking-widest mb-6">{group.title}</h4>
              <ul className="space-y-4">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-zinc-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-zinc-400 font-medium">
            © 2024 NusaAI Technology. Seluruh hak cipta dilindungi.
          </p>
          <div className="flex items-center gap-8 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
            <Link href="#" className="hover:text-zinc-900 transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-zinc-900 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
