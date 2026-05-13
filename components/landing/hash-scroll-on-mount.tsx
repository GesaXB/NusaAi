"use client";

import { useEffect } from "react";
import { scrollToHash } from "@/lib/hash-nav";

/** After landing loads with a URL hash, scroll to that section (e.g. from /blog via /#features). */
export function HashScrollOnMount() {
  useEffect(() => {
    const { hash } = window.location;
    if (!hash) return;
    const run = () => scrollToHash(hash);
    requestAnimationFrame(() => requestAnimationFrame(run));
  }, []);
  return null;
}
