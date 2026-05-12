"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { Mail, ArrowRight, Eye, EyeOff, CheckCircle2, ArrowLeft, AlertCircle, RefreshCcw, KeyRound, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Toast } from "@/components/ui/toast";

type Mode = "login" | "signup" | "verify" | "forgot" | "otp" | "new-password";

export default function LoginPage() {
  const [mode, setMode] = useState<Mode>("login");
  const [verifyType, setVerifyType] = useState<"signup" | "recovery">("signup");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const [authChecking, setAuthChecking] = useState(true);
  const [toast, setToast] = useState<{ open: boolean; message: string; variant: "success" | "error" | "info" }>({ open: false, message: "", variant: "success" });
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const router = useRouter();
  const supabase = createClient();

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

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  if (authChecking) return null;

  const showToast = (message: string, variant: "success" | "error" | "info" = "success") => {
    setToast({ open: true, message, variant });
    setTimeout(() => setToast(prev => ({ ...prev, open: false })), 3000);
  };

  const validatePassword = (pw: string) => {
    if (pw.length < 8) return "Password minimal harus 8 karakter.";
    if (/["<>{} ]/.test(pw)) return "Password tidak boleh mengandung spasi atau karakter: \" < > { }";
    return null;
  };

  // ===== OTP Handlers =====
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newOtp = [...otp];
    for (let i = 0; i < 6; i++) {
      newOtp[i] = pasted[i] || "";
    }
    setOtp(newOtp);
    const focusIndex = Math.min(pasted.length, 5);
    otpRefs.current[focusIndex]?.focus();
  };

  // ===== Submit Handlers =====
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (mode === "signup") {
      const pwError = validatePassword(password);
      if (pwError) { setError(pwError); setLoading(false); return; }
    }

    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        showToast("Login berhasil! Mengalihkan ke dashboard...", "success");
        setTimeout(() => router.push("/dashboard"), 1500);
      } else if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: `${window.location.origin}/api/auth/callback?type=signup` },
        });
        if (error) {
          if (error.message.toLowerCase().includes("already registered") || error.message.toLowerCase().includes("already been registered")) {
            setError("Email sudah terdaftar. Silakan login atau cek email untuk konfirmasi.");
            setLoading(false); return;
          }
          throw error;
        }
        if (data.user && data.user.identities && data.user.identities.length === 0) {
          setError("Email ini sudah didaftarkan. Silakan cek inbox email kamu untuk konfirmasi.");
          setLoading(false); return;
        }
        showToast("Registrasi berhasil! Kode OTP dikirim ke email.", "success");
        setVerifyType("signup");
        setMode("otp"); 
        setOtp(["", "", "", "", "", ""]);
      }
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { setError("Masukkan email terlebih dahulu."); return; }
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      showToast("Kode OTP telah dikirim ke email kamu.", "success");
      setVerifyType("recovery");
      setMode("otp");
      setOtp(["", "", "", "", "", ""]);
    } catch (err: any) {
      setError(err.message || "Gagal mengirim kode OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = otp.join("");
    if (token.length !== 6) { setError("Masukkan 6 digit kode OTP."); return; }
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.auth.verifyOtp({ 
        email, 
        token, 
        type: verifyType
      });
      
      if (error) throw error;
      
      if (verifyType === "signup") {
        showToast("Email berhasil diverifikasi!", "success");
        setTimeout(() => router.push("/auth/confirmed"), 1000);
      } else {
        showToast("Kode OTP berhasil diverifikasi!", "success");
        setMode("new-password");
        setPassword("");
        setConfirmPw("");
      }
    } catch (err: any) {
      setError("Kode OTP tidak valid atau sudah kedaluwarsa.");
    } finally {
      setLoading(false);
    }
  };

  const handleSetNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const pwErr = validatePassword(password);
    if (pwErr) { setError(pwErr); return; }
    if (password !== confirmPw) { setError("Password tidak cocok."); return; }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      showToast("Password berhasil diubah! Mengalihkan...", "success");
      setTimeout(() => router.push("/dashboard"), 1500);
    } catch (err: any) {
      setError(err.message || "Gagal menyimpan password.");
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
        type: 'signup', email,
        options: { emailRedirectTo: `${window.location.origin}/api/auth/callback?type=signup` },
      });
      if (error) throw error;
      showToast("Email verifikasi telah dikirim ulang.", "success");
      setCooldown(60);
    } catch (err: any) {
      setError(err.message || "Gagal mengirim ulang email.");
    } finally {
      setResending(false);
    }
  };

  const handleResendOtp = async () => {
    if (cooldown > 0) return;
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      showToast("Kode OTP baru telah dikirim.", "success");
      setCooldown(60);
      setOtp(["", "", "", "", "", ""]);
    } catch (err: any) {
      setError(err.message || "Gagal mengirim ulang kode.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/api/auth/callback?next=/dashboard` },
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || "Gagal masuk dengan Google.");
      setLoading(false);
    }
  };

  // ===== RENDER =====
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
      <Toast open={toast.open} message={toast.message} variant={toast.variant} onClose={() => setToast(prev => ({ ...prev, open: false }))} />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm"
      >
        <AnimatePresence mode="wait">
          {/* ===== OTP INPUT (Unified for Signup & Recovery) ===== */}
          {mode === "otp" ? (
            <motion.div key="otp" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="text-center">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <ShieldCheck className="w-8 h-8 text-blue-500" />
              </div>
              <h2 className="text-2xl font-extrabold text-zinc-900 mb-2">Masukkan Kode OTP</h2>
              <p className="text-zinc-500 text-sm leading-relaxed mb-8">
                Kode 6 digit telah dikirim ke <span className="font-semibold text-zinc-900">{email}</span>
              </p>
              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div className="flex justify-center gap-2 sm:gap-3" onPaste={handleOtpPaste}>
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => { otpRefs.current[i] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={e => handleOtpChange(i, e.target.value)}
                      onKeyDown={e => handleOtpKeyDown(i, e)}
                      className="w-11 h-13 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-bold rounded-xl border-2 border-zinc-200 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10 outline-none transition-all bg-zinc-50 text-zinc-900"
                    />
                  ))}
                </div>

                {error && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 rounded-xl text-xs font-semibold flex items-center gap-2 bg-red-50 text-red-500 border border-red-100">
                    <AlertCircle className="w-4 h-4 shrink-0" />{error}
                  </motion.div>
                )}

                <Button type="submit" className="w-full h-11 rounded-xl gap-2 bg-zinc-900 hover:bg-zinc-800" loading={loading} disabled={otp.join("").length !== 6}>
                  Verifikasi Kode <ArrowRight className="w-4 h-4" />
                </Button>

                <button type="button" onClick={verifyType === "signup" ? handleResend : handleResendOtp} disabled={cooldown > 0}
                  className={`flex items-center justify-center gap-2 text-sm font-bold transition-all w-full ${cooldown > 0 ? "text-zinc-300 cursor-not-allowed" : "text-zinc-900 hover:text-brand-red"}`}>
                  <RefreshCcw className="w-3.5 h-3.5" />
                  {cooldown > 0 ? `Kirim ulang dalam ${cooldown}s` : "Kirim ulang kode OTP"}
                </button>
              </form>
              <button onClick={() => { setMode(verifyType === "signup" ? "signup" : "forgot"); setError(null); }} className="flex items-center justify-center gap-2 w-full text-xs font-semibold text-zinc-400 hover:text-zinc-900 transition-colors py-3 mt-2">
                <ArrowLeft className="w-3.5 h-3.5" /> Kembali
              </button>
            </motion.div>
          ) : mode === "forgot" ? (
            <motion.div key="forgot" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="text-center">
              <div className="w-16 h-16 bg-zinc-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <KeyRound className="w-8 h-8 text-zinc-600" />
              </div>
              <h2 className="text-2xl font-extrabold text-zinc-900 mb-2">Lupa Password?</h2>
              <p className="text-zinc-500 text-sm leading-relaxed mb-8">Masukkan email kamu dan kami akan mengirimkan kode OTP.</p>
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <Input type="email" placeholder="kamu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} icon={<Mail className="w-4 h-4" />} required className="rounded-xl border-zinc-100" />
                {error && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 rounded-xl text-xs font-semibold flex items-center gap-2 bg-red-50 text-red-500 border border-red-100">
                    <AlertCircle className="w-4 h-4 shrink-0" />{error}
                  </motion.div>
                )}
                <Button type="submit" className="w-full h-11 rounded-xl gap-2 bg-zinc-900 hover:bg-zinc-800" loading={loading}>
                  Kirim Kode OTP <ArrowRight className="w-4 h-4" />
                </Button>
              </form>
              <button onClick={() => { setMode("login"); setError(null); }} className="flex items-center justify-center gap-2 w-full text-xs font-semibold text-zinc-400 hover:text-zinc-900 transition-colors py-3 mt-4">
                <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Login
              </button>
            </motion.div>


          /* ===== NEW PASSWORD ===== */
          ) : mode === "new-password" ? (
            <motion.div key="new-pw" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="text-center">
              <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <KeyRound className="w-8 h-8 text-emerald-500" />
              </div>
              <h2 className="text-2xl font-extrabold text-zinc-900 mb-2">Atur Password Baru</h2>
              <p className="text-zinc-500 text-sm leading-relaxed mb-8">Buat password baru untuk akun NusaAI kamu.</p>
              <form onSubmit={handleSetNewPassword} className="space-y-4 text-left">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-700">Password Baru</label>
                  <div className="relative">
                    <input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="Minimal 8 karakter"
                      className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-sm focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/5 outline-none transition-all" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-700">Konfirmasi Password</label>
                  <input type={showPassword ? "text" : "password"} value={confirmPw} onChange={e => setConfirmPw(e.target.value)} placeholder="Ulangi password baru"
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-sm focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/5 outline-none transition-all" />
                </div>
                {error && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 rounded-xl text-xs font-semibold flex items-center gap-2 bg-red-50 text-red-500 border border-red-100">
                    <AlertCircle className="w-4 h-4 shrink-0" />{error}
                  </motion.div>
                )}
                <Button type="submit" className="w-full h-11 rounded-xl gap-2 bg-zinc-900 hover:bg-zinc-800" loading={loading}>
                  Simpan Password Baru <ArrowRight className="w-4 h-4" />
                </Button>
              </form>
            </motion.div>

          /* ===== LOGIN / SIGNUP FORM ===== */
          ) : (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="text-center mb-10">
                <Link href="/" className="inline-flex items-center gap-2.5 mb-8">
                  <Image src="/logo.png" alt="NusaAI" width={32} height={32} className="rounded-lg" />
                  <span className="text-xl font-bold text-zinc-900 tracking-tight">Nusa<span className="text-brand-red">AI</span></span>
                </Link>
                <h1 className="text-2xl font-extrabold text-zinc-900">
                  {mode === "login" ? "Selamat datang kembali" : "Buat akun gratis"}
                </h1>
                <p className="text-sm text-zinc-500 mt-2">
                  {mode === "login" ? "Masuk ke akun NusaAI kamu" : "Mulai belajar lebih cerdas dengan AI"}
                </p>
              </div>

              <div className="space-y-5">
                {error && (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                    className="p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 bg-red-50 text-red-500 border border-red-100">
                    <AlertCircle className="w-4 h-4 shrink-0" />{error}
                  </motion.div>
                )}

                <Button variant="outline" className="w-full h-11 gap-3 rounded-xl font-semibold border-zinc-100 hover:bg-zinc-50 transition-all" onClick={handleGoogle} loading={loading}>
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
                    <Input id="email" type="email" placeholder="kamu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} icon={<Mail className="w-4 h-4" />} required className="rounded-xl border-zinc-100" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-zinc-700 mb-1.5 block">Password</label>
                    <div className="relative">
                      <Input id="password" type={showPassword ? "text" : "password"} placeholder="Minimal 8 karakter" value={password} onChange={(e) => setPassword(e.target.value)} required className="pr-10 rounded-xl border-zinc-100" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors">
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
                      <button type="button" onClick={() => { setMode("forgot"); setError(null); }} className="text-xs text-brand-red hover:text-brand-red-dark transition-colors font-bold">
                        Lupa password?
                      </button>
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
                <button onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(null); }} className="text-brand-red hover:text-brand-red-dark font-bold transition-colors">
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
