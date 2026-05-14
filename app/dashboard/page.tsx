import type { Metadata } from "next";
import DashboardClient from "./dashboard-client";

export const metadata: Metadata = {
  title: "Chat Baru",
  description: "Mulai percakapan baru dengan NusaAI untuk membantu belajarmu.",
};

export default function Page() {
  return <DashboardClient />;
}
