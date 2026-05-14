import type { Metadata } from "next";
import HistoryPage from "./history-client";

export const metadata: Metadata = {
  title: "Riwayat Chat",
  description: "Lihat kembali semua percakapan belajar Anda dengan NusaAI.",
};

export default function Page() {
  return <HistoryPage />;
}
