"use client";

import { Navbar } from "@/components/landing/navbar";
import { CTASection } from "@/components/landing/cta-section";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { BLOG_POSTS } from "@/lib/blog-data";

export default function BlogClient() {
  return (
    <main className="bg-white min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="pt-40 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-brand-red font-semibold text-sm tracking-wide mb-3">
              Blog
            </p>
            <h1 className="text-4xl md:text-6xl font-bold text-zinc-900 leading-[1.1] tracking-tight max-w-2xl mb-6">
              Insight & inspirasi untuk belajar lebih cerdas.
            </h1>
            <p className="text-lg text-zinc-500 max-w-xl leading-relaxed">
              Eksplorasi strategi belajar, update produk, dan wawasan
              teknologi pendidikan dari tim NusaAI.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="px-6 pb-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
          >
            <Link
              href={`/blog/${BLOG_POSTS[0].slug}`}
              className="group relative flex flex-col md:flex-row rounded-3xl overflow-hidden bg-zinc-950 min-h-[360px]"
            >
              <div className="relative md:w-3/5 aspect-[16/10] md:aspect-auto overflow-hidden">
                <img
                  src={BLOG_POSTS[0].image}
                  alt={BLOG_POSTS[0].title}
                  className="w-full h-full object-cover opacity-70 group-hover:opacity-60 group-hover:scale-105 transition-all duration-700"
                />
              </div>
              <div className="relative flex flex-col justify-center p-8 md:p-12 md:w-2/5">
                <span className="inline-flex self-start px-3 py-1 rounded-full bg-white/10 text-[11px] font-semibold text-white/80 uppercase tracking-wider mb-5">
                  {BLOG_POSTS[0].category}
                </span>
                <h2 className="text-2xl md:text-3xl font-bold text-white leading-snug mb-4">
                  {BLOG_POSTS[0].title}
                </h2>
                <p className="text-white/50 text-sm leading-relaxed line-clamp-3 mb-6">
                  {BLOG_POSTS[0].excerpt}
                </p>
                <div className="flex items-center gap-3">
                  <img
                    src={BLOG_POSTS[0].author.avatar}
                    alt={BLOG_POSTS[0].author.name}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-white/20"
                  />
                  <div className="text-xs text-white/60">
                    <span className="font-semibold text-white/90">
                      {BLOG_POSTS[0].author.name}
                    </span>
                    <span className="mx-2">·</span>
                    <span>{BLOG_POSTS[0].date}</span>
                    <span className="mx-2">·</span>
                    <span>{BLOG_POSTS[0].readTime} baca</span>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* All Posts Grid */}
      <section className="px-6 pb-28">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {BLOG_POSTS.map((post, i) => (
              <motion.article
                key={post.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col h-full rounded-2xl border border-zinc-100 hover:border-zinc-200 bg-white hover:shadow-lg hover:shadow-zinc-100/80 transition-all duration-300 overflow-hidden"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-zinc-100">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex flex-col flex-1 p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xs font-semibold text-brand-red">
                        {post.category}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-zinc-300" />
                      <span className="text-xs text-zinc-400">
                        {post.date}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-zinc-900 leading-snug group-hover:text-brand-red transition-colors line-clamp-2 mb-2">
                      {post.title}
                    </h3>
                    <p className="text-sm text-zinc-500 leading-relaxed line-clamp-2 mb-5">
                      {post.excerpt}
                    </p>
                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-zinc-50">
                      <div className="flex items-center gap-2">
                        <img
                          src={post.author.avatar}
                          alt={post.author.name}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <span className="text-xs font-medium text-zinc-600">
                          {post.author.name}
                        </span>
                      </div>
                      <span className="text-xs font-medium text-zinc-400 group-hover:text-brand-red transition-colors flex items-center gap-1">
                        Baca
                        <ArrowUpRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </main>
  );
}
