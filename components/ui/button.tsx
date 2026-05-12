"use client";

import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const base =
      "inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/30 disabled:opacity-50 disabled:pointer-events-none select-none";

    const variants = {
      primary:
        "bg-brand-red hover:bg-brand-red-dark text-white active:scale-[0.97]",
      secondary:
        "bg-zinc-100 hover:bg-zinc-200 text-zinc-900 active:scale-[0.97]",
      ghost:
        "hover:bg-zinc-100 text-zinc-600 hover:text-zinc-900 active:scale-[0.97]",
      outline:
        "border border-zinc-200 hover:border-zinc-300 text-zinc-700 hover:bg-zinc-50 active:scale-[0.97]",
      danger:
        "bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 active:scale-[0.97]",
    };

    const sizes = {
      sm: "h-8 px-3 text-sm",
      md: "h-10 px-4 text-sm",
      lg: "h-12 px-6 text-base",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      >
        {loading ? (
          <>
            <span className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
            <span>Memuat...</span>
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
export { Button };
