"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export type MegaColumn = {
  label: string;
  href: string;
  photo?: string;
  count: number;
  children: { label: string; href: string; count: number }[];
};

/**
 * Product mega menu. Opens on hover or click, closes on Escape, outside click or navigation.
 * Columns come from the BigCommerce category tree (server-side), so categories and counts are always live.
 */
export function MegaMenu({
  label,
  href,
  columns,
  allLabel,
  navLabel,
}: {
  label: string;
  href: string;
  columns: MegaColumn[];
  allLabel: string;
  navLabel: string;
}) {
  const [open, setOpen] = useState(false);
  // Hover previews the menu; a click pins it open (a second click, Escape or an outside click closes it).
  const [pinned, setPinned] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const pathname = usePathname();

  const close = () => {
    setOpen(false);
    setPinned(false);
  };

  // Close when the route changes (adjusting state during render, as React recommends, instead of in an effect).
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    close();
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    const onDown = (e: MouseEvent) => !root.current?.contains(e.target as Node) && close();
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
    };
  }, [open]);

  const hold = () => {
    clearTimeout(timer.current);
    setOpen(true);
  };
  const release = () => {
    clearTimeout(timer.current);
    if (!pinned) timer.current = setTimeout(() => setOpen(false), 160);
  };

  return (
    <div ref={root} onMouseEnter={hold} onMouseLeave={release}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mega-menu-panel"
        onClick={() => (open && pinned ? close() : (setOpen(true), setPinned(true)))}
        className={`flex items-center gap-1.5 text-[0.95rem] font-medium transition-colors hover:text-ink ${open ? "text-ink" : "text-slate"}`}
      >
        <span className={open ? "underline decoration-amber decoration-2 underline-offset-[6px]" : ""}>{label}</span>
        <svg aria-hidden width="10" height="10" viewBox="0 0 10 10" className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
          <path d="M1 3l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      </button>

      {open && (
        <div
          id="mega-menu-panel"
          role="region"
          aria-label={navLabel}
          className="absolute inset-x-0 top-full z-40 max-h-[75vh] overflow-y-auto border-b border-line bg-paper"
        >
          <div className="page py-8">
            <ul className="grid gap-x-8 gap-y-8 sm:grid-cols-2 md:grid-cols-5">
              {columns.map((c) => (
                <li key={c.href}>
                  {c.photo && (
                    <Link href={c.href} className="mb-4 hidden overflow-hidden rounded-[4px] bg-bench md:block">
                      <Image src={`/images/categories/${c.photo}`} alt="" width={240} height={180} className="aspect-[4/3] w-full object-cover" />
                    </Link>
                  )}
                  <Link
                    href={c.href}
                    className="font-display text-lg font-extrabold leading-tight [font-stretch:88%] underline decoration-transparent decoration-2 underline-offset-4 hover:decoration-amber"
                  >
                    {c.label}
                  </Link>
                  <ul className="mt-3 space-y-2 text-[0.93rem]">
                    {c.children.map((s) => (
                      <li key={s.href}>
                        <Link href={s.href} className="flex justify-between gap-3 text-slate hover:text-ink hover:underline hover:decoration-amber hover:decoration-2">
                          <span>{s.label}</span>
                          <span className="text-xs leading-6">{s.count}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
            <div className="mt-8 border-t border-line pt-4">
              <Link href={href} className="font-semibold underline decoration-amber decoration-2 underline-offset-4">
                {allLabel}
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
