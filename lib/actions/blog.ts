"use server";

import { prisma } from "@/lib/prisma/client";
import { revalidatePath } from "next/cache";

export async function createPost(data: {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  category?: string;
  image?: string;
  published?: boolean;
}) {
  const post = await prisma.post.create({
    data: {
      ...data,
      published: data.published ?? false,
    },
  });
  
  revalidatePath("/blog");
  revalidatePath("/dashboard/admin/blog");
  return post;
}

export async function updatePost(id: string, data: Partial<{
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: string;
  image: string;
  published: boolean;
}>) {
  const post = await prisma.post.update({
    where: { id },
    data,
  });
  
  revalidatePath("/blog");
  revalidatePath("/dashboard/admin/blog");
  return post;
}

export async function deletePost(id: string) {
  await prisma.post.delete({
    where: { id },
  });
  
  revalidatePath("/blog");
  revalidatePath("/dashboard/admin/blog");
}
