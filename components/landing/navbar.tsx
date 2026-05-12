"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X, ArrowRight, LayoutDashboard, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";

const NAV_LINKS = [
  { label: "Fitur", href: "#features" },
  { label: "Preview", href: "#demo" },
  { label: "Blog", href: "/blog" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Check auth state
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

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const close = useCallback(() => setMobileOpen(false), []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/");
    close();
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
          ? "bg-white/90 backdrop-blur-xl shadow-[0_1px_0_0_rgba(0,0,0,0.03)] py-3"
          : "bg-transparent py-5"
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <Image
            src="/logo.png"
            alt="NusaAI"
            width={28}
            height={28}
            className="rounded-lg"
          />
          <span className="font-bold text-lg text-zinc-900 tracking-tight">
            Nusa<span className="text-brand-red">AI</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => {
            const isHash = link.href.startsWith("#");
            const href = isHash && pathname !== "/" ? `/${link.href}` : link.href;
            return (
              <Link
                key={link.label}
                href={href}
                className="text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <button
                onClick={handleLogout}
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
                <Button
                  variant="outline"
                  className="rounded-full border-zinc-200 text-sm font-semibold px-5 h-9 hover:bg-zinc-50 transition-all"
                >
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

        {/* Mobile Toggle */}
        <button
          className="md:hidden relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-zinc-100 transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 top-0 bg-white z-40 flex flex-col md:hidden"
          >
            {/* Mobile Header */}
            <div className="flex items-center justify-between px-6 py-5">
              <Link href="/" className="flex items-center gap-2.5" onClick={close}>
                <Image
                  src="/logo.png"
                  alt="NusaAI"
                  width={28}
                  height={28}
                  className="rounded-lg"
                />
                <span className="font-bold text-lg text-zinc-900 tracking-tight">
                  Nusa<span className="text-brand-red">AI</span>
                </span>
              </Link>
              <button
                onClick={close}
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-zinc-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Links */}
            <nav className="flex-1 flex flex-col justify-center px-6 gap-2">
              {NAV_LINKS.map((link, i) => {
                const isHash = link.href.startsWith("#");
                const href = isHash && pathname !== "/" ? `/${link.href}` : link.href;
                return (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 + 0.1 }}
                  >
                    <Link
                      href={href}
                      onClick={close}
                      className="block text-3xl font-bold text-zinc-900 hover:text-brand-red py-3 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            {/* Mobile Actions */}
            <div className="px-6 pb-8 flex flex-col gap-3">
              {user ? (
                <>
                  <Link href="/dashboard" onClick={close}>
                    <Button className="w-full h-12 rounded-full bg-zinc-900 text-white font-semibold gap-2">
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Button>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full h-12 rounded-full border border-red-100 text-red-500 font-semibold flex items-center justify-center gap-2 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Keluar
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={close}>
                    <Button
                      variant="outline"
                      className="w-full h-12 rounded-full border-zinc-200 font-semibold"
                    >
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
      </AnimatePresence>
    </header>
  );
}
