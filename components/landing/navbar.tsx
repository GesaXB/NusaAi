"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X, ArrowRight, LayoutDashboard, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { scrollToHash } from "@/lib/hash-nav";

const NAV_LINKS = [
  { label: "Fitur", href: "#features" },
  { label: "Preview", href: "#demo" },
  { label: "Blog", href: "/blog" },
];

interface NavbarProps {
  /** Blog (and similar): always solid white bar; use with top padding on content below fixed header. */
  variant?: "default" | "solid";
}

export function Navbar({ variant = "default" }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const solidBar = variant === "solid";
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    checkUser();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!mobileOpen) {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.documentElement.style.overflow = "";
      return;
    }
    const scrollY = window.scrollY;
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.documentElement.style.overflow = "";
      window.scrollTo(0, scrollY);
    };
  }, [mobileOpen]);

  const close = useCallback(() => setMobileOpen(false), []);

  const handleLogout = async () => {
    setShowLogoutConfirm(false);
    await supabase.auth.signOut();
    setUser(null);
    router.push("/");
    close();
  };

  return (
    <>
      <ConfirmDialog
        open={showLogoutConfirm}
        title="Keluar dari NusaAI?"
        message="Kamu akan keluar dari akun. Semua sesi aktif akan dihentikan."
        confirmText="Ya, Keluar"
        cancelText="Batal"
        variant="danger"
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutConfirm(false)}
      />

      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          solidBar
            ? "bg-white border-b border-zinc-200/80 shadow-sm py-3.5"
            : scrolled
              ? "bg-white/90 backdrop-blur-xl shadow-[0_1px_0_0_rgba(0,0,0,0.03)] py-3"
              : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <Image src="/logo.png" alt="NusaAI" width={28} height={28} className="rounded-lg" />
            <span className="font-bold text-lg text-zinc-900 tracking-tight">
              Nusa<span className="text-brand-red">AI</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => {
              const isHash = link.href.startsWith("#");
              const hashHref = isHash ? `/${link.href}` : link.href;
              if (isHash) {
                return (
                  <Link
                    key={link.label}
                    href={hashHref}
                    scroll={false}
                    onClick={(e) => {
                      if (pathname === "/") {
                        e.preventDefault();
                        scrollToHash(link.href);
                      }
                    }}
                    className="text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
                  >
                    {link.label}
                  </Link>
                );
              }
              return (
                <Link key={link.label} href={link.href} className="text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors">
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <button
                  onClick={() => setShowLogoutConfirm(true)}
                  className="flex items-center gap-2 text-sm font-semibold text-zinc-500 hover:text-red-500 transition-colors px-3 py-2 rounded-full hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4" />
                  Keluar
                </button>
                <Link href="/dashboard">
                  <Button className="rounded-full bg-zinc-900 hover:bg-zinc-800 text-white px-5 h-9 text-sm font-semibold transition-all gap-1.5">
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    Dashboard
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="outline" className="rounded-full border-zinc-200 text-sm font-semibold px-5 h-9 hover:bg-zinc-50 transition-all">
                    Masuk
                  </Button>
                </Link>
                <Link href="/demo">
                  <Button className="rounded-full bg-zinc-900 hover:bg-zinc-800 text-white px-5 h-9 text-sm font-semibold transition-all gap-1.5">
                    Demo
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </>
            )}
          </div>

          <button
            className="md:hidden relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-zinc-100 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {mobileOpen && (
              <motion.div
                key="mobile-nav-sheet"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-[60] flex flex-col bg-white md:hidden min-h-[100dvh] max-h-[100dvh] overscroll-y-contain"
              >
                <div className="flex items-center justify-between px-6 py-5 shrink-0 border-b border-zinc-100/80">
                  <Link href="/" className="flex items-center gap-2.5" onClick={close}>
                    <Image src="/logo.png" alt="NusaAI" width={28} height={28} className="rounded-lg" />
                    <span className="font-bold text-lg text-zinc-900 tracking-tight">
                      Nusa<span className="text-brand-red">AI</span>
                    </span>
                  </Link>
                  <button
                    type="button"
                    onClick={close}
                    className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-zinc-100 transition-colors"
                    aria-label="Tutup menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="flex-1 flex flex-col justify-start px-6 gap-1 pt-6 pb-4 min-h-0 overflow-y-auto overscroll-y-contain touch-pan-y [-webkit-overflow-scrolling:touch]">
                  {NAV_LINKS.map((link, i) => {
                    const isHash = link.href.startsWith("#");
                    const hashHref = isHash ? `/${link.href}` : link.href;
                    return (
                      <motion.div
                        key={link.label}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 + 0.08 }}
                      >
                        {isHash ? (
                          <Link
                            href={hashHref}
                            scroll={false}
                            onClick={(e) => {
                              close();
                              if (pathname === "/") {
                                e.preventDefault();
                                scrollToHash(link.href);
                              }
                            }}
                            className="block text-3xl font-bold text-zinc-900 hover:text-brand-red py-3 transition-colors"
                          >
                            {link.label}
                          </Link>
                        ) : (
                          <Link
                            href={link.href}
                            onClick={close}
                            className="block text-3xl font-bold text-zinc-900 hover:text-brand-red py-3 transition-colors"
                          >
                            {link.label}
                          </Link>
                        )}
                      </motion.div>
                    );
                  })}
                </nav>

                <div className="px-6 pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-4 shrink-0 flex flex-col gap-3 border-t border-zinc-100/80 bg-white">
                  {user ? (
                    <>
                      <Link href="/dashboard" onClick={close}>
                        <Button className="w-full h-12 rounded-full bg-zinc-900 text-white font-semibold gap-2">
                          <LayoutDashboard className="w-4 h-4" />
                          Dashboard
                        </Button>
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          close();
                          setShowLogoutConfirm(true);
                        }}
                        className="w-full h-12 rounded-full border border-red-100 text-red-500 font-semibold flex items-center justify-center gap-2 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Keluar
                      </button>
                    </>
                  ) : (
                    <>
                      <Link href="/login" onClick={close}>
                        <Button variant="outline" className="w-full h-12 rounded-full border-zinc-200 font-semibold">
                          Masuk
                        </Button>
                      </Link>
                      <Link href="/demo" onClick={close}>
                        <Button className="w-full h-12 rounded-full bg-zinc-900 text-white font-semibold gap-2">
                          Mulai Belajar
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}
