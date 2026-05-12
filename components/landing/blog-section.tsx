"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, MoveRight } from "lucide-react";
import Link from "next/link";
import { getRecentPosts } from "@/lib/blog-data";

const posts = getRecentPosts(3);

export function BlogSection() {
  return (
    <section id="blog" className="relative py-28 md:py-36 bg-white overflow-hidden">
      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle, #18181b 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-14">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-brand-red font-semibold text-sm tracking-wide mb-3"
          >
            Blog
          </motion.p>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 }}
              className="text-3xl md:text-[2.75rem] font-bold text-zinc-900 leading-[1.15] tracking-tight max-w-lg"
            >
              Insight & artikel terbaru dari tim kami.
            </motion.h2>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
            >
              <Link
                href="/blog"
                className="group inline-flex items-center gap-2 text-sm font-semibold text-zinc-500 hover:text-zinc-900 transition-colors"
              >
                Semua Artikel
                <MoveRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Cards – Featured + Two Stacked */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Featured (first post) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <Link
              href={`/blog/${posts[0].slug}`}
              className="group relative flex flex-col h-full rounded-3xl overflow-hidden bg-zinc-950"
            >
              <div className="relative aspect-[4/3] lg:aspect-auto lg:flex-1 overflow-hidden">
                <img
                  src={posts[0].image}
                  alt={posts[0].title}
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-50 group-hover:scale-105 transition-all duration-700"
                  loading="lazy"
                />
              </div>
              <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-10">
                <span className="inline-flex self-start px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm text-[11px] font-semibold text-white/90 uppercase tracking-wider mb-4">
                  {posts[0].category}
                </span>
                <h3 className="text-2xl md:text-3xl font-bold text-white leading-snug mb-3 max-w-md">
                  {posts[0].title}
                </h3>
                <p className="text-white/60 text-sm leading-relaxed line-clamp-2 max-w-sm mb-5">
                  {posts[0].excerpt}
                </p>
                <div className="flex items-center gap-3">
                  <img
                    src={posts[0].author.avatar}
                    alt={posts[0].author.name}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-white/20"
                  />
                  <div className="text-xs text-white/70">
                    <span className="font-semibold text-white/90">{posts[0].author.name}</span>
                    <span className="mx-2">·</span>
                    <span>{posts[0].date}</span>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Right column – two stacked cards */}
          <div className="flex flex-col gap-6">
            {posts.slice(1).map((post, i) => (
              <motion.div
                key={post.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 + i * 0.1 }}
                className="flex-1"
              >
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col sm:flex-row gap-5 p-4 rounded-2xl border border-zinc-100 hover:border-zinc-200 bg-white hover:shadow-lg hover:shadow-zinc-100/80 transition-all duration-300 h-full"
                >
                  <div className="relative w-full sm:w-48 md:w-56 shrink-0 aspect-[16/10] sm:aspect-square rounded-xl overflow-hidden bg-zinc-100">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex flex-col justify-center py-1 flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xs font-semibold text-brand-red">
                        {post.category}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-zinc-300" />
                      <span className="text-xs text-zinc-400">{post.date}</span>
                    </div>
                    <h3 className="text-lg font-bold text-zinc-900 leading-snug group-hover:text-brand-red transition-colors line-clamp-2 mb-2">
                      {post.title}
                    </h3>
                    <p className="text-sm text-zinc-500 leading-relaxed line-clamp-2 mb-4">
                      {post.excerpt}
                    </p>
                    <div className="mt-auto flex items-center gap-2 text-xs font-semibold text-zinc-400 group-hover:text-brand-red transition-colors">
                      Baca artikel
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
