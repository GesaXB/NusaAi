import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "NusaAI — Platform Belajar AI #1 untuk Pelajar Indonesia",
    template: "%s | NusaAI",
  },
  description:
    "NusaAI adalah platform belajar berbasis AI yang dirancang khusus untuk pelajar Indonesia. Upload materi PDF, tanya AI tutor cerdas, buat quiz otomatis, dan kuasai materi lebih cepat dengan konteks kurikulum lokal.",
  keywords: [
    "NusaAI",
    "AI belajar",
    "platform belajar AI Indonesia",
    "tutor AI",
    "ringkasan PDF",
    "quiz otomatis",
    "kurikulum merdeka",
    "belajar online",
    "AI pendidikan",
  ],
  authors: [{ name: "NusaAI Team", url: "https://nusa-ai.com" }],
  creator: "NusaAI",
  publisher: "NusaAI",
  metadataBase: new URL("https://nusa-ai.com"),
  openGraph: {
    title: "NusaAI — Platform Belajar AI #1 untuk Pelajar Indonesia",
    description:
      "Upload materi, tanya AI tutor cerdas, buat quiz otomatis. Belajar jadi 4x lebih cepat dengan NusaAI.",
    type: "website",
    locale: "id_ID",
    siteName: "NusaAI",
    url: "https://nusa-ai.com",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "NusaAI Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NusaAI — Platform Belajar AI #1 untuk Pelajar Indonesia",
    description:
      "Upload materi, tanya AI tutor cerdas, buat quiz otomatis. Belajar jadi 4x lebih cepat.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${playfair.variable} ${plusJakarta.variable} ${geistMono.variable}`}
    >
      <body className="min-h-screen bg-white text-zinc-900 antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
