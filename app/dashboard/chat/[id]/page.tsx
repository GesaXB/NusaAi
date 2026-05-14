import { getChat } from "@/lib/actions/chat";
import ChatIdClient from "@/components/chat/chat-id-client";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { Message } from "@/types";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const chat = await getChat(id);
  
  if (!chat) {
    return {
      title: "Chat Tidak Ditemukan",
    };
  }

  return {
    title: chat.title || "Percakapan",
    description: `Lanjutkan belajar tentang ${chat.title} dengan NusaAI.`,
  };
}

export default async function ChatIdPage({ params }: Props) {
  const { id } = await params;
  const chat = await getChat(id);

  if (!chat) {
    notFound();
  }

  return <ChatIdClient id={id} initialMessages={chat.messages as Message[]} />;
}
