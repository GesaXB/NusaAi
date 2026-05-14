"use server";

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma/client";
import { generateId } from "@/lib/utils";
import { SYSTEM_PROMPT } from "@/types";

async function generateChatTitle(firstUserMessage: string, firstAssistantMessage?: string): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return firstUserMessage.slice(0, 40);

  const context = firstAssistantMessage 
    ? `User: ${firstUserMessage}\nAssistant: ${firstAssistantMessage}`
    : firstUserMessage;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-flash-1.5-8b",
        messages: [
          {
            role: "system",
            content: "Buat judul sangat singkat (2-3 kata) dalam Bahasa Indonesia untuk chat ini berdasarkan percakapan berikut. Fokus pada topik utama. Jangan gunakan tanda kutip atau titik.",
          },
          { role: "user", content: context },
        ],
        max_tokens: 20,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`OpenRouter Error (${response.status}):`, errorText);
      return firstUserMessage.slice(0, 40);
    }

    const data = await response.json();
    const title = data.choices?.[0]?.message?.content?.trim();
    return title || firstUserMessage.slice(0, 40);
  } catch (error) {
    console.error("Error generating title:", error);
    return firstUserMessage.slice(0, 40);
  }
}


export async function saveChatHistory(chatId: string | null, title: string, messages: any[]) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  // Ensure user exists in Prisma to avoid foreign key violation
  try {
    await prisma.user.upsert({
      where: { id: user.id },
      update: { email: user.email! },
      create: {
        id: user.id,
        email: user.email!,
        name: user.user_metadata?.full_name || user.email?.split("@")[0],
      },
    });
  } catch (error) {
    console.error("Failed to sync user to Prisma:", error);
    // Continue anyway, but this might lead to the Chat creation failing again
  }

  try {
    let currentChatId = chatId;

    if (!currentChatId) {
      // Create new chat with temporary title
      const chat = await prisma.chat.create({
        data: {
          id: generateId(),
          userId: user.id,
          title: "Menyiapkan chat...",
        },
      });
      currentChatId = chat.id;
    }

    // Check if we should update/generate the title
    const existingChat = await prisma.chat.findUnique({
      where: { id: currentChatId },
      select: { title: true }
    });

    const hasAssistantResponse = messages.some(m => m.role === "assistant" && m.content.length > 10);
    const isDefaultTitle = existingChat?.title === "Chat Baru" || existingChat?.title === "Menyiapkan chat..." || !existingChat?.title;

    if (isDefaultTitle && hasAssistantResponse) {
      const firstUser = messages.find(m => m.role === "user")?.content || "";
      const firstAssistant = messages.find(m => m.role === "assistant")?.content || "";
      const aiTitle = await generateChatTitle(firstUser, firstAssistant);
      
      await prisma.chat.update({
        where: { id: currentChatId },
        data: { title: aiTitle },
      });
    }

    // Since we don't want to do complex diffs of messages, the simplest way
    // is to clear and recreate messages for this chat, OR update existing ones.
    // For performance, deleting all and recreating might be slow for huge chats,
    // but it's the most robust simple way. Let's do an upsert approach instead.
    
    // Actually, prisma transaction to delete old and insert new is safe and atomic.
    await prisma.$transaction([
      prisma.message.deleteMany({
        where: { chatId: currentChatId },
      }),
      prisma.message.createMany({
        data: messages.map((m) => ({
          id: m.id,
          chatId: currentChatId!,
          role: m.role,
          content: m.content,
          createdAt: m.createdAt ? new Date(m.createdAt) : new Date(),
        })),
      }),
    ]);

    console.log("Chat saved successfully with ID:", currentChatId);
    
    // Get the final title to return to client
    const finalChat = await prisma.chat.findUnique({
      where: { id: currentChatId },
      select: { title: true }
    });

    return { success: true, chatId: currentChatId, title: finalChat?.title };
  } catch (error: any) {
    console.error("Failed to save chat! ERROR DETAILS:", error);
    return { success: false, error: error.message };
  }
}

export async function getChat(chatId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const chat = await prisma.chat.findUnique({
    where: { id: chatId },
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!chat || chat.userId !== user.id) return null;

  return chat;
}

export async function getRecentChats() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  return await prisma.chat.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 20,
    select: {
      id: true,
      title: true,
      createdAt: true,
    },
  });
}

export async function deleteChat(chatId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return false;

  await prisma.chat.deleteMany({
    where: { id: chatId, userId: user.id },
  });

  return true;
}
