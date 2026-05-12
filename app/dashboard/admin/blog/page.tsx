"use client";

import { useState } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";
import { AI_MODELS } from "@/types";
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Eye, 
  Newspaper,
  CheckCircle,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

// Mock data for blog posts
const MOCK_POSTS = [
  {
    id: "1",
    title: "Cara Efektif Belajar dengan Bantuan AI",
    category: "Tips Belajar",
    status: "published",
    date: "12 Mei 2024",
    author: "Tim NusaAI",
  },
  {
    id: "2",
    title: "Mengapa Kurikulum Lokal Penting untuk AI Pendidikan",
    category: "Teknologi",
    status: "published",
    date: "10 Mei 2024",
    author: "Budi Santoso",
  },
  {
    id: "3",
    title: "Update Fitur: Analisis PDF Lebih Cepat",
    category: "Product Update",
    status: "draft",
    date: "08 Mei 2024",
    author: "Admin",
  },
];

export default function AdminBlogPage() {
  const [modelId, setModelId] = useState(AI_MODELS[0].id);
  const [search, setSearch] = useState("");

  return (
    <div className="flex h-screen bg-zinc-50 overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <Topbar modelId={modelId} onModelChange={setModelId} userName="Admin" />

        <div className="flex-1 overflow-y-auto p-6 lg:p-10">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="text-2xl font-bold text-zinc-900 mb-1 flex items-center gap-2">
                  <Newspaper className="w-6 h-6 text-brand-red" />
                  Manajemen Blog
                </h1>
                <p className="text-zinc-500 text-sm">Kelola artikel dan konten edukasi NusaAI.</p>
              </div>
              <Button className="gap-2 rounded-xl h-11 px-6 shadow-lg shadow-brand-red/20">
                <Plus className="w-4 h-4" />
                Artikel Baru
              </Button>
            </div>

            {/* Toolbar */}
            <div className="bg-white p-4 rounded-2xl border border-zinc-100 shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Cari judul artikel..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/10 transition-all"
                />
              </div>
              <div className="flex items-center gap-2 w-full md:w-auto">
                <select className="bg-zinc-50 border border-zinc-100 rounded-xl text-sm px-4 py-2 focus:outline-none w-full md:w-auto">
                  <option>Semua Status</option>
                  <option>Published</option>
                  <option>Draft</option>
                </select>
                <select className="bg-zinc-50 border border-zinc-100 rounded-xl text-sm px-4 py-2 focus:outline-none w-full md:w-auto">
                  <option>Semua Kategori</option>
                  <option>Tips Belajar</option>
                  <option>Teknologi</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-50/50 border-b border-zinc-100">
                    <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-wider">Artikel</th>
                    <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-wider">Kategori</th>
                    <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-wider">Tanggal</th>
                    <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-wider text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50">
                  {MOCK_POSTS.map((post) => (
                    <tr key={post.id} className="hover:bg-zinc-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-zinc-900 group-hover:text-brand-red transition-colors">{post.title}</span>
                          <span className="text-xs text-zinc-400 mt-0.5">Oleh: {post.author}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-medium text-zinc-600 bg-zinc-100 px-2 py-1 rounded-md">
                          {post.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {post.status === "published" ? (
                          <div className="flex items-center gap-1.5 text-emerald-600">
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span className="text-xs font-bold uppercase tracking-wider">Published</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-zinc-400">
                            <Clock className="w-3.5 h-3.5" />
                            <span className="text-xs font-bold uppercase tracking-wider">Draft</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-zinc-500 font-medium">{post.date}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-2 rounded-lg text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-all">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button className="p-2 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 transition-all">
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <button className="p-2 rounded-lg text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-all">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {MOCK_POSTS.length === 0 && (
                <div className="py-20 text-center">
                  <Newspaper className="w-12 h-12 text-zinc-200 mx-auto mb-4" />
                  <p className="text-zinc-500 font-medium">Belum ada artikel.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
