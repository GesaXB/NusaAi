"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Mail, ArrowRight, Eye, EyeOff, CheckCircle2, ArrowLeft, AlertCircle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "signup" | "verify">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const [authChecking, setAuthChecking] = useState(true);
  
  const router = useRouter();
  const supabase = createClient();

  // Redirect if already logged in — show nothing until check completes
  useEffect(() => {
    const checkSession = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        router.replace("/dashboard");
      } else {
        setAuthChecking(false);
      }
    };
    checkSession();
  }, []);

  // Cooldown timer logic
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  // Block render until auth check is done (MUST be after all hooks)
  if (authChecking) return null;

  const validatePassword = (pw: string) => {
    if (pw.length < 8) return "Password minimal harus 8 karakter.";
    const restrictedChars = /["<>{} ]/;
    if (restrictedChars.test(pw)) return "Password tidak boleh mengandung spasi atau karakter: \" < > { }";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (mode === "signup") {
      const pwError = validatePassword(password);
      if (pwError) {
        setError(pwError);
        setLoading(false);
        return;
      }
    }

    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push("/dashboard");
      } else if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/api/auth/callback`,
          },
        });
        if (error) throw error;
        setMode("verify");
        setCooldown(60); // Start 1 minute cooldown
      }
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat mencoba masuk.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0 || resending) return;
    
    setResending(true);
    setError(null);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/api/auth/callback`,
        }
      });
      if (error) throw error;
      setCooldown(60);
    } catch (err: any) {
      setError(err.message || "Gagal mengirim ulang email.");
    } finally {
      setResending(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || "Gagal masuk dengan Google.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm"
      >
        <AnimatePresence mode="wait">
          {mode === "verify" ? (
            <motion.div
              key="verify"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              </div>
              <h2 className="text-2xl font-extrabold text-zinc-900 mb-2">Cek email kamu</h2>
              <p className="text-zinc-500 text-sm leading-relaxed mb-8">
                Link verifikasi telah dikirim ke <span className="font-semibold text-zinc-900">{email}</span>. Silakan klik link tersebut untuk mengaktifkan akunmu.
              </p>
              
              <div className="space-y-4">
                <Button 
                  variant="outline" 
                  className="w-full h-11 rounded-xl font-bold"
                  onClick={() => window.open(`https://${email.split("@")[1]}`, "_blank")}
                >
                  Buka Email Provider
                </Button>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={handleResend}
                    disabled={cooldown > 0 || resending}
                    className={`flex items-center justify-center gap-2 text-sm font-bold transition-all ${
                      cooldown > 0 || resending 
                      ? "text-zinc-300 cursor-not-allowed" 
                      : "text-zinc-900 hover:text-brand-red"
                    }`}
                  >
                    <RefreshCcw className={`w-3.5 h-3.5 ${resending ? "animate-spin" : ""}`} />
                    {cooldown > 0 ? `Kirim ulang dalam ${cooldown}s` : "Kirim ulang email"}
                  </button>
                  
                  <button 
                    onClick={() => setMode("login")}
                    className="flex items-center justify-center gap-2 w-full text-xs font-semibold text-zinc-400 hover:text-zinc-900 transition-colors py-2"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Kembali ke Login
                  </button>
                </div>
              </div>

              {error && (
                <p className="mt-4 text-xs text-red-500 font-medium">{error}</p>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Logo */}
              <div className="text-center mb-10">
                <Link href="/" className="inline-flex items-center gap-2.5 mb-8">
                  <Image
                    src="/logo.png"
                    alt="NusaAI"
                    width={32}
                    height={32}
                    className="rounded-lg"
                  />
                  <span className="text-xl font-bold text-zinc-900 tracking-tight">
                    Nusa<span className="text-brand-red">AI</span>
                  </span>
                </Link>
                <h1 className="text-2xl font-extrabold text-zinc-900">
                  {mode === "login" ? "Selamat datang kembali" : "Buat akun gratis"}
                </h1>
                <p className="text-sm text-zinc-500 mt-2">
                  {mode === "login"
                    ? "Masuk ke akun NusaAI kamu"
                    : "Mulai belajar lebih cerdas dengan AI"}
                </p>
              </div>

              {/* Form Card */}
              <div className="space-y-5">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 bg-red-50 text-red-500 border border-red-100"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {error}
                  </motion.div>
                )}

                <Button
                  variant="outline"
                  className="w-full h-11 gap-3 rounded-xl font-semibold border-zinc-100 hover:bg-zinc-50 transition-all"
                  onClick={handleGoogle}
                  loading={loading}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Lanjutkan dengan Google
                </Button>

                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-zinc-100" />
                  <span className="text-xs text-zinc-400">atau</span>
                  <div className="flex-1 h-px bg-zinc-100" />
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-zinc-700 mb-1.5 block">Email</label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="kamu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      icon={<Mail className="w-4 h-4" />}
                      required
                      className="rounded-xl border-zinc-100"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-zinc-700 mb-1.5 block">Password</label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Minimal 8 karakter"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="pr-10 rounded-xl border-zinc-100"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {mode === "signup" && (
                      <p className="text-[10px] text-zinc-400 mt-1.5 font-medium">
                        Password minimal 8 karakter tanpa simbol &quot; &lt; &gt; {"{"} {"}"}
                      </p>
                    )}
                  </div>

                  {mode === "login" && (
                    <div className="text-right">
                      <a href="#" className="text-xs text-brand-red hover:text-brand-red-dark transition-colors font-bold">
                        Lupa password?
                      </a>
                    </div>
                  )}

                  <Button type="submit" className="w-full h-11 rounded-xl gap-2 bg-zinc-900 hover:bg-zinc-800 shadow-lg shadow-zinc-200/50" loading={loading}>
                    {mode === "login" ? "Masuk" : "Daftar Sekarang"}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </form>
              </div>

              <p className="text-center text-sm text-zinc-500 mt-6">
                {mode === "login" ? "Belum punya akun? " : "Sudah punya akun? "}
                <button
                  onClick={() => setMode(mode === "login" ? "signup" : "login")}
                  className="text-brand-red hover:text-brand-red-dark font-bold transition-colors"
                >
                  {mode === "login" ? "Daftar gratis" : "Masuk"}
                </button>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
