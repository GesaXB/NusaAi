import type { Metadata } from "next";
import BlogClient from "./blog-client";

export const metadata: Metadata = {
  title: "Blog & Wawasan Belajar",
  description: "Temukan tips belajar, strategi penguasaan materi, dan update terbaru seputar teknologi AI untuk pendidikan di blog NusaAI.",
};

export default function Page() {
  return <BlogClient />;
}
