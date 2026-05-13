/**
 * Smooth-scroll to an element by hash (e.g. "#features"). Fixed headers: use scroll-mt on targets.
 */
export function scrollToHash(hash: string) {
  if (typeof document === "undefined") return;
  const id = hash.startsWith("#") ? hash.slice(1) : hash;
  if (!id) return;
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}
