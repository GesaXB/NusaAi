"use client";

import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "blue" | "cyan" | "green" | "yellow";
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  const variants = {
    default: "bg-zinc-800 text-zinc-400 border-zinc-700",
    blue: "bg-blue-600/10 text-blue-400 border-blue-600/20",
    cyan: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    green: "bg-green-600/10 text-green-400 border-green-600/20",
    yellow: "bg-yellow-600/10 text-yellow-400 border-yellow-600/20",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
