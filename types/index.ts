export type Role = "user" | "assistant" | "system";

export interface Message {
  id: string;
  role: Role;
  content: string;
  createdAt?: Date;
}

export interface Chat {
  id: string;
  title: string;
  createdAt: Date;
  messages?: Message[];
}

export interface User {
  id: string;
  name: string | null;
  email: string;
  avatar: string | null;
  createdAt: Date;
}

export interface Document {
  id: string;
  userId: string;
  name: string;
  embeddingStatus: "pending" | "processing" | "done" | "error";
  createdAt: Date;
}

export interface AIModel {
  id: string;
  name: string;
  description: string;
  provider: string;
}

export const AI_MODELS: AIModel[] = [
  {
    id: "deepseek/deepseek-chat",
    name: "DeepSeek V3",
    description: "Sangat Cepat & Pintar",
    provider: "DeepSeek",
  },
  {
    id: "google/gemini-flash-1.5",
    name: "Gemini 1.5 Flash",
    description: "Stabil & Responsif",
    provider: "Google",
  },
  {
    id: "meta-llama/llama-3.1-8b-instruct",
    name: "Llama 3.1 8B",
    description: "Efisien & Akurat",
    provider: "Meta",
  },
];

export const SYSTEM_PROMPT = `You are NusaAI, a professional AI tutor for Indonesian students.

GUIDELINES:
1. STRICTLY NO EMOJIS.
2. Provide clear, accurate, and educational responses.
3. Be concise but ensure the explanation is easy to understand.
4. Use Bahasa Indonesia as the primary language.
5. Format responses with clean markdown (bold, lists, code blocks).
6. Maintain a helpful and encouraging tone without being overly wordy.`;
