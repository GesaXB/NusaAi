import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Kelola percakapan, materi PDF, dan kuis belajar Anda dengan NusaAI.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
