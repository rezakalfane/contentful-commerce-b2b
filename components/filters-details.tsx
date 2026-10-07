"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * The filter panel: a <details> that is open by default (so it works without JavaScript and on desktop, where the
 * summary is hidden) and collapses once on small screens so the product grid is visible first.
 */
export function FiltersDetails({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    if (window.matchMedia("(max-width: 1023px)").matches && ref.current) ref.current.open = false;
  }, []);
  return (
    <details ref={ref} open className={className}>
      {children}
    </details>
  );
}
