"use client";

import { useParams } from "next/navigation";
import { Navbar } from "@/components/landing/navbar";
import { CTASection } from "@/components/landing/cta-section";
import { getBlogPost, getRecentPosts, type BlogPost } from "@/lib/blog-data";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight, Calendar, Clock, User } from "lucide-react";
import Link from "next/link";

function BlogContent({ post }: { post: BlogPost }) {
  const relatedPosts = getRecentPosts(3).filter((p) => p.slug !== post.slug);

  return (
    <main className="bg-white min-h-screen">
      <Navbar variant="solid" />

      <div className="pt-16 md:pt-[4.5rem]">
      {/* Hero Image */}
      <div className="relative w-full h-[50vh] md:h-[60vh] overflow-hidden bg-zinc-950">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent" />

        {/* Back button */}
        <div className="absolute top-6 left-0 right-0 px-6 md:top-8">
          <div className="max-w-4xl mx-auto">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-medium text-white/70 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Blog
            </Link>
          </div>
        </div>

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <span className="inline-flex px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-[11px] font-semibold text-white/80 uppercase tracking-wider mb-5">
              {post.category}
            </span>
            <h1 className="text-3xl md:text-5xl font-bold text-white leading-[1.15] tracking-tight mb-6 max-w-3xl">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-5 text-sm text-white/60">
              <div className="flex items-center gap-2.5">
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-white/20"
                />
                <div>
                  <p className="font-semibold text-white/90 text-sm">
                    {post.author.name}
                  </p>
                  <p className="text-xs text-white/50">{post.author.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>{post.date}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>{post.readTime} baca</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Article Body */}
      <section className="px-6 py-16 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          {/* Excerpt */}
          <p className="text-xl md:text-2xl text-zinc-600 leading-relaxed font-medium mb-12 pb-12 border-b border-zinc-100">
            {post.excerpt}
          </p>

          {/* Markdown Content */}
          <div className="prose-blog">
            {post.content.split("\n").map((line, idx) => {
              const trimmed = line.trim();
              if (!trimmed) return <div key={idx} className="h-4" />;

              // H2
              if (trimmed.startsWith("## ")) {
                return (
                  <h2
                    key={idx}
                    className="text-2xl md:text-3xl font-bold text-zinc-900 mt-12 mb-5 leading-snug tracking-tight"
                  >
                    {trimmed.replace("## ", "")}
                  </h2>
                );
              }
              // H3
              if (trimmed.startsWith("### ")) {
                return (
                  <h3
                    key={idx}
                    className="text-xl font-bold text-zinc-900 mt-8 mb-4 leading-snug"
                  >
                    {trimmed.replace("### ", "")}
                  </h3>
                );
              }
              // Blockquote
              if (trimmed.startsWith("> ")) {
                return (
                  <blockquote
                    key={idx}
                    className="border-l-3 border-brand-red pl-5 py-1 my-6 text-zinc-600 italic text-lg"
                  >
                    {trimmed.replace("> ", "").replace(/"/g, "")}
                  </blockquote>
                );
              }
              // Ordered list
              if (/^\d+\.\s/.test(trimmed)) {
                const text = trimmed.replace(/^\d+\.\s/, "");
                return (
                  <div key={idx} className="flex gap-3 ml-1 mb-2">
                    <span className="text-brand-red font-bold text-sm mt-0.5 shrink-0">
                      {trimmed.match(/^\d+/)?.[0]}.
                    </span>
                    <p className="text-zinc-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: formatInline(text) }} />
                  </div>
                );
              }
              // Unordered list
              if (trimmed.startsWith("- ")) {
                const text = trimmed.replace("- ", "");
                return (
                  <div key={idx} className="flex gap-3 ml-1 mb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-red mt-2.5 shrink-0" />
                    <p className="text-zinc-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: formatInline(text) }} />
                  </div>
                );
              }
              // Paragraph
              return (
                <p
                  key={idx}
                  className="text-zinc-600 leading-[1.85] mb-4 text-[16.5px]"
                  dangerouslySetInnerHTML={{ __html: formatInline(trimmed) }}
                />
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="px-6 pb-24 border-t border-zinc-100">
          <div className="max-w-7xl mx-auto pt-16">
            <h2 className="text-2xl font-bold text-zinc-900 mb-10">
              Artikel Lainnya
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedPosts.map((rp, i) => (
                <motion.div
                  key={rp.slug}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Link
                    href={`/blog/${rp.slug}`}
                    className="group flex flex-col sm:flex-row gap-5 p-4 rounded-2xl border border-zinc-100 hover:border-zinc-200 bg-white hover:shadow-lg hover:shadow-zinc-100/80 transition-all duration-300"
                  >
                    <div className="relative w-full sm:w-48 shrink-0 aspect-[16/10] sm:aspect-square rounded-xl overflow-hidden bg-zinc-100">
                      <img
                        src={rp.image}
                        alt={rp.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                    <div className="flex flex-col justify-center py-1 flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-xs font-semibold text-brand-red">
                          {rp.category}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-zinc-300" />
                        <span className="text-xs text-zinc-400">{rp.date}</span>
                      </div>
                      <h3 className="text-lg font-bold text-zinc-900 leading-snug group-hover:text-brand-red transition-colors line-clamp-2 mb-2">
                        {rp.title}
                      </h3>
                      <p className="text-sm text-zinc-500 leading-relaxed line-clamp-2">
                        {rp.excerpt}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      <CTASection />
      </div>
    </main>
  );
}

/** Simple inline markdown formatter for bold text */
function formatInline(text: string): string {
  return text.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-zinc-900">$1</strong>');
}

export default function BlogDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const post = getBlogPost(slug);

  if (!post) {
    return (
      <main className="bg-white min-h-screen">
        <Navbar variant="solid" />
        <div className="pt-16 md:pt-[4.5rem] px-6">
        <div className="flex flex-col items-center justify-center min-h-[70vh]">
          <h1 className="text-3xl font-bold text-zinc-900 mb-4">
            Artikel tidak ditemukan
          </h1>
          <p className="text-zinc-500 mb-8">
            Maaf, artikel yang kamu cari tidak tersedia.
          </p>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-zinc-900 text-white text-sm font-semibold hover:bg-zinc-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Blog
          </Link>
        </div>
        </div>
      </main>
    );
  }

  return <BlogContent post={post} />;
}
