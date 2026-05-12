"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

interface ToastProps {
  open: boolean;
  message: string;
  variant?: "success" | "error" | "info";
  onClose?: () => void;
}

const icons = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
};

const colors = {
  success: { bg: "bg-emerald-50 border-emerald-200", icon: "text-emerald-500", text: "text-emerald-800" },
  error: { bg: "bg-red-50 border-red-200", icon: "text-red-500", text: "text-red-800" },
  info: { bg: "bg-blue-50 border-blue-200", icon: "text-blue-500", text: "text-blue-800" },
};

export function Toast({ open, message, variant = "success", onClose }: ToastProps) {
  const Icon = icons[variant];
  const color = colors[variant];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed top-6 left-1/2 -translate-x-1/2 z-[200]"
        >
          <div className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl border shadow-xl ${color.bg}`}>
            <Icon className={`w-5 h-5 flex-shrink-0 ${color.icon}`} />
            <p className={`text-sm font-semibold ${color.text}`}>{message}</p>
            {onClose && (
              <button onClick={onClose} className="ml-2 p-1 rounded-lg hover:bg-white/50 transition-colors">
                <X className={`w-3.5 h-3.5 ${color.icon}`} />
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
