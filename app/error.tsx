"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[NusaAI Error]", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4 text-center">
      <div>
        <div className="w-14 h-14 rounded-2xl bg-red-600/10 border border-red-600/20 flex items-center justify-center mx-auto mb-5">
          <AlertTriangle className="w-7 h-7 text-red-400" />
        </div>
        <h2 className="text-xl font-bold text-zinc-100 mb-2">Terjadi Kesalahan</h2>
        <p className="text-zinc-400 text-sm mb-6 max-w-sm">
          Sesuatu tidak berjalan dengan benar. Coba lagi atau muat ulang halaman.
        </p>
        <div className="flex gap-3 justify-center">
          <Button variant="outline" onClick={() => window.location.href = "/"}>
            Ke Beranda
          </Button>
          <Button onClick={reset}>Coba Lagi</Button>
        </div>
        {process.env.NODE_ENV === "development" && (
          <details className="mt-6 text-left max-w-md mx-auto">
            <summary className="text-xs text-zinc-600 cursor-pointer hover:text-zinc-400">
              Detail error (dev only)
            </summary>
            <pre className="mt-2 text-xs text-red-400 bg-zinc-900 border border-zinc-800 rounded-xl p-4 overflow-auto">
              {error.message}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}
