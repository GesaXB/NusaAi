"use client";

import { useState, useRef, useEffect } from "react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { FileUp, X, CheckCircle, Loader2, FileText, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

type UploadStatus = "idle" | "uploading" | "done" | "error";

interface UploadedFile {
  name: string;
  size: number;
  status: UploadStatus;
}

export default function UploadPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const addFile = (file: File) => {
    if (file.type !== "application/pdf") return;
    const newFile: UploadedFile = { name: file.name, size: file.size, status: "uploading" };
    setFiles((prev) => [...prev, newFile]);
    setTimeout(() => {
      setFiles((prev) =>
        prev.map((f) => (f.name === newFile.name ? { ...f, status: "done" } : f))
      );
    }, 2000);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    Array.from(e.dataTransfer.files).forEach(addFile);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    Array.from(e.target.files ?? []).forEach(addFile);
  };

  const removeFile = (name: string) =>
    setFiles((prev) => prev.filter((f) => f.name !== name));

  const formatSize = (bytes: number) =>
    bytes < 1024 * 1024
      ? `${(bytes / 1024).toFixed(0)} KB`
      : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

  return (
    <DashboardShell>
      <div className="h-full overflow-y-auto p-4 sm:p-6 lg:p-10 bg-zinc-50/50">
        <div className="max-w-2xl mx-auto w-full">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-zinc-900 mb-1 tracking-tight">Upload PDF</h1>
            <p className="text-zinc-500 text-sm">
              Upload materi belajarmu dan biarkan AI merangkumnya untukmu.
            </p>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center gap-6 p-12 rounded-3xl border border-zinc-100 bg-white shadow-sm">
              <Skeleton className="w-16 h-16 rounded-2xl" />
              <div className="flex flex-col items-center gap-2">
                <Skeleton className="h-5 w-48 rounded" />
                <Skeleton className="h-4 w-64 rounded" />
              </div>
              <Skeleton className="h-10 w-40 rounded-full" />
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
              className={cn(
                "relative flex flex-col items-center justify-center gap-6 p-12 rounded-3xl border-2 border-dashed cursor-pointer transition-all duration-300",
                isDragging
                  ? "border-brand-red bg-brand-red/5"
                  : "border-zinc-200 hover:border-brand-red/30 bg-white hover:shadow-xl hover:shadow-zinc-200/50"
              )}
            >
              <input
                ref={inputRef}
                type="file"
                accept=".pdf"
                multiple
                className="hidden"
                onChange={handleInput}
              />
              <div className={cn(
                "w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-sm",
                isDragging ? "bg-brand-red scale-110" : "bg-zinc-50"
              )}>
                <FileUp className={cn("w-8 h-8 transition-colors duration-300", isDragging ? "text-white" : "text-zinc-400")} />
              </div>
              <div className="text-center">
                <p className="text-zinc-900 font-bold mb-1">
                  {isDragging ? "Lepaskan untuk upload" : "Drag & drop PDF di sini"}
                </p>
                <p className="text-sm text-zinc-500 font-medium">atau klik untuk memilih file</p>
              </div>
              <Button variant="outline" size="sm" className="pointer-events-none rounded-full px-8">
                Pilih File PDF
              </Button>
            </motion.div>
          )}

          <AnimatePresence>
            {files.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-8 flex flex-col gap-3"
              >
                <div className="flex items-center justify-between px-2">
                  <p className="text-sm font-bold text-zinc-900">{files.length} File dipilih</p>
                  <button 
                    onClick={() => setFiles([])}
                    className="text-xs text-zinc-400 hover:text-zinc-600 font-bold transition-colors"
                  >
                    Hapus Semua
                  </button>
                </div>
                
                {files.map((file, i) => (
                  <motion.div
                    key={file.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-4 p-4 rounded-2xl border border-zinc-100 bg-white shadow-sm hover:shadow-md transition-shadow group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-zinc-50 flex items-center justify-center flex-shrink-0 group-hover:bg-brand-red/5 transition-colors">
                      <FileText className="w-5 h-5 text-zinc-400 group-hover:text-brand-red transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-zinc-900 truncate">{file.name}</p>
                      <p className="text-xs text-zinc-400 mt-0.5 font-medium">{formatSize(file.size)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      {file.status === "uploading" && (
                        <div className="flex items-center gap-2 text-brand-red">
                          <Loader2 className="w-4 h-4 animate-spin" />
                        </div>
                      )}
                      {file.status === "done" && (
                        <div className="flex items-center gap-2 text-emerald-500">
                          <CheckCircle className="w-4 h-4" />
                        </div>
                      )}
                      <button
                        onClick={(e) => { e.stopPropagation(); removeFile(file.name); }}
                        className="p-1.5 rounded-lg text-zinc-300 hover:text-zinc-600 hover:bg-zinc-100 transition-all flex-shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}

                {files.some((f) => f.status === "done") && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4"
                  >
                    <Button className="w-full h-12 rounded-2xl gap-2 font-bold text-base shadow-xl shadow-brand-red/20 bg-brand-red hover:bg-brand-red-dark">
                      <FileText className="w-5 h-5" />
                      Mulai Ringkaskan dengan AI
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </DashboardShell>
  );
}
