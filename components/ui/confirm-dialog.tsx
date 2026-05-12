"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: "danger" | "info";
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmText = "Ya, lanjutkan",
  cancelText = "Batal",
  onConfirm,
  onCancel,
  variant = "danger",
}: ConfirmDialogProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
          />
          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed inset-0 flex items-center justify-center z-[101] px-4"
          >
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 space-y-5">
              <div className="flex items-start justify-between">
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${
                  variant === "danger" ? "bg-red-50" : "bg-blue-50"
                }`}>
                  <AlertTriangle className={`w-5 h-5 ${
                    variant === "danger" ? "text-red-500" : "text-blue-500"
                  }`} />
                </div>
                <button
                  onClick={onCancel}
                  className="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-700 hover:bg-zinc-50 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div>
                <h3 className="text-lg font-bold text-zinc-900 mb-1">{title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{message}</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={onCancel}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm font-bold text-zinc-700 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 transition-all"
                >
                  {cancelText}
                </button>
                <button
                  onClick={onConfirm}
                  className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-bold text-white transition-all active:scale-95 ${
                    variant === "danger"
                      ? "bg-red-500 hover:bg-red-600 shadow-lg shadow-red-200/50"
                      : "bg-blue-500 hover:bg-blue-600 shadow-lg shadow-blue-200/50"
                  }`}
                >
                  {confirmText}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
