import { prisma } from "./prisma/client";

export async function getPosts() {
  return await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getPostBySlug(slug: string) {
  return await prisma.post.findUnique({
    where: { slug },
  });
}

// For demo purposes, we'll keep the static posts as fallback if DB is empty
export const STATIC_POSTS = [
  {
    id: "1",
    title: "Cara Efektif Belajar dengan Bantuan AI",
    slug: "cara-efektif-belajar-ai",
    excerpt: "Temukan strategi terbaik untuk memanfaatkan kecerdasan buatan dalam rutinitas belajar harianmu.",
    date: "12 Mei 2024",
    author: "Tim NusaAI",
    category: "Tips Belajar",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2671&auto=format&fit=crop",
  },
  {
    id: "2",
    title: "Mengapa Kurikulum Lokal Penting untuk AI Pendidikan",
    slug: "kurikulum-lokal-ai",
    excerpt: "Analisis mendalam tentang mengapa model AI yang dilatih dengan konteks Indonesia memberikan hasil lebih akurat.",
    date: "10 Mei 2024",
    author: "Budi Santoso",
    category: "Teknologi",
    image: "https://images.unsplash.com/photo-1454165833762-0104b273546a?q=80&w=2670&auto=format&fit=crop",
  },
];
