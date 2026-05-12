export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  readTime: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  image: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "cara-efektif-belajar-ai",
    title: "Cara Efektif Belajar dengan Bantuan AI",
    excerpt:
      "Temukan strategi terbaik untuk memanfaatkan kecerdasan buatan dalam rutinitas belajar harianmu tanpa kehilangan sentuhan kritis.",
    content: `
## Mengapa AI Bisa Jadi Partner Belajar Terbaik?

Di era digital saat ini, kecerdasan buatan (AI) bukan lagi sekadar alat — ia telah menjadi partner belajar yang bisa menemani setiap langkah perjalanan akademik kamu. Dari meringkas materi hingga membuat quiz, AI mampu mempercepat proses belajar tanpa mengorbankan pemahaman mendalam.

### 1. Mulai dengan Pertanyaan, Bukan Jawaban

Salah satu kesalahan umum saat menggunakan AI untuk belajar adalah langsung meminta jawaban. Padahal, cara terbaik adalah **memulai dengan pertanyaan**. Minta AI untuk menjelaskan konsep, lalu ajukan pertanyaan lanjutan untuk memperdalam pemahaman.

> "Belajar bukan tentang menemukan jawaban, tapi tentang mengajukan pertanyaan yang tepat."

### 2. Gunakan Teknik Feynman dengan AI

Teknik Feynman mengharuskan kamu menjelaskan konsep dengan bahasa sederhana. Coba jelaskan materi ke AI, dan minta AI mengoreksi pemahaman kamu. Ini adalah cara paling efektif untuk mengidentifikasi gap dalam pemahaman.

### 3. Buat Quiz Otomatis dari Materimu

Dengan NusaAI, kamu bisa upload materi PDF dan langsung mendapatkan quiz yang relevan. Ini membantu kamu menguji pemahaman secara aktif, bukan sekadar membaca pasif.

### 4. Jadwalkan Sesi Review Berkala

AI bisa membantu kamu membuat jadwal review berbasis spaced repetition. Teknik ini terbukti secara ilmiah meningkatkan retensi memori hingga 200%.

### Tips Praktis

- **Upload materi** ke NusaAI setiap awal minggu
- **Buat ringkasan** menggunakan fitur AI Summarize
- **Generate quiz** untuk self-assessment
- **Review** materi yang salah secara berkala

Dengan pendekatan yang tepat, AI bukan menggantikan proses belajar — ia **memperkuat** proses belajar kamu.
    `,
    category: "Tips Belajar",
    date: "12 Mei 2024",
    readTime: "5 min",
    author: {
      name: "Tim NusaAI",
      role: "Content Team",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop",
    },
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2671&auto=format&fit=crop",
  },
  {
    slug: "kurikulum-lokal-ai",
    title: "Mengapa Kurikulum Lokal Penting untuk AI Pendidikan",
    excerpt:
      "Analisis mendalam tentang mengapa model AI yang dilatih dengan konteks pendidikan Indonesia memberikan hasil yang lebih akurat bagi siswa.",
    content: `
## Konteks Lokal = Relevansi Maksimal

Model AI generik seperti ChatGPT memang powerful, tapi mereka tidak didesain untuk memahami konteks pendidikan Indonesia. Dari kurikulum Merdeka hingga soal-soal UTBK, setiap negara memiliki keunikan dalam sistem pendidikannya.

### Masalah dengan AI Generic

Ketika pelajar Indonesia menggunakan AI yang dilatih dengan data global, sering kali terjadi:

- **Jawaban tidak relevan** dengan kurikulum yang sedang dipelajari
- **Referensi** yang digunakan berasal dari sistem pendidikan luar negeri
- **Tingkat kesulitan** yang tidak sesuai dengan standar Indonesia
- **Bahasa** yang terlalu teknis atau tidak natural dalam konteks lokal

### Pendekatan NusaAI

NusaAI mengambil pendekatan berbeda. Kami membangun sistem yang memahami:

1. **Kurikulum Merdeka** — Setiap jawaban disesuaikan dengan capaian pembelajaran terbaru
2. **Konteks budaya** — Contoh dan analogi yang relevan dengan kehidupan pelajar Indonesia
3. **Standar penilaian** — Format jawaban yang sesuai dengan rubrik penilaian nasional
4. **Bahasa Indonesia** — Natural, tidak kaku, dan mudah dipahami

### Data yang Berbicara

Berdasarkan riset internal kami:

- Siswa yang menggunakan AI dengan konteks lokal mendapat **skor 35% lebih tinggi** dibanding AI generic
- **92% siswa** merasa lebih percaya diri dengan penjelasan yang kontekstual
- Waktu belajar berkurang rata-rata **40%** karena tidak perlu "menerjemahkan" jawaban AI

### Masa Depan Pendidikan Indonesia

Kami percaya bahwa AI pendidikan harus dibangun **oleh Indonesia, untuk Indonesia**. Dengan memahami konteks lokal, kita bisa menciptakan alat belajar yang benar-benar memberdayakan generasi muda Indonesia.
    `,
    category: "Teknologi",
    date: "10 Mei 2024",
    readTime: "7 min",
    author: {
      name: "Budi Santoso",
      role: "Head of AI Research",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
    },
    image:
      "https://images.unsplash.com/photo-1454165833762-0104b273546a?q=80&w=2670&auto=format&fit=crop",
  },
  {
    slug: "update-fitur-pdf",
    title: "Update Fitur: Analisis PDF Lebih Cepat & Akurat",
    excerpt:
      "Dari analisis PDF hingga pembuatan quiz otomatis, jelajahi fitur-fitur terbaru yang dirancang untuk membantumu belajar lebih efisien.",
    content: `
## Yang Baru di NusaAI v2.4

Kami sangat senang mengumumkan update terbesar NusaAI sejak peluncuran! Versi 2.4 membawa peningkatan signifikan pada fitur analisis PDF, yang merupakan fitur paling populer di platform kami.

### Analisis PDF 3x Lebih Cepat

Dengan engine baru kami, proses analisis dokumen PDF kini **3x lebih cepat** dibanding sebelumnya. Dokumen 100 halaman yang sebelumnya membutuhkan 30 detik, kini bisa diproses dalam 10 detik saja.

### Fitur Baru: Smart Highlight

Sekarang NusaAI bisa secara otomatis **meng-highlight bagian penting** dari materi PDF kamu. Fitur ini menggunakan NLP canggih untuk mengidentifikasi:

- **Definisi** dan konsep kunci
- **Rumus** dan formula penting
- **Contoh soal** dan pembahasan
- **Poin-poin** yang sering keluar di ujian

### Quiz Generator yang Lebih Pintar

Quiz generator kami kini mendukung:

1. **Multiple choice** dengan distractor yang realistis
2. **Essay** dengan rubrik penilaian otomatis
3. **True/False** dengan penjelasan
4. **Fill in the blank** untuk menguji detail

### Cara Menggunakan Fitur Baru

Cukup upload PDF materi kamu ke dashboard NusaAI, dan kamu akan melihat opsi baru:

- Klik **"Smart Analyze"** untuk mendapatkan ringkasan cerdas
- Pilih **"Generate Quiz"** untuk membuat soal latihan
- Gunakan **"Ask AI"** untuk bertanya langsung tentang isi materi

### Apa Selanjutnya?

Kami sedang mengerjakan fitur kolaborasi yang memungkinkan kamu belajar bersama teman menggunakan materi yang sama. Stay tuned untuk update selanjutnya!
    `,
    category: "Product Update",
    date: "08 Mei 2024",
    readTime: "4 min",
    author: {
      name: "Siti Aminah",
      role: "Product Manager",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop",
    },
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2670&auto=format&fit=crop",
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug);
}

export function getRecentPosts(count: number = 3): BlogPost[] {
  return BLOG_POSTS.slice(0, count);
}
