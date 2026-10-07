"use client";

import { useEffect, useRef, useState } from "react";

/** Min/max price inputs that apply 700 ms after typing stops, and reset when the filter is cleared elsewhere. */
export function PriceRange({ min, max, minLabel, maxLabel }: { min?: number; max?: number; minLabel: string; maxLabel: string }) {
  const [lo, setLo] = useState(min != null ? String(min) : "");
  const [hi, setHi] = useState(max != null ? String(max) : "");
  const last = useRef(`${min ?? ""}|${max ?? ""}`);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const incoming = `${min ?? ""}|${max ?? ""}`;
    if (incoming !== last.current) {
      last.current = incoming;
      setLo(min != null ? String(min) : "");
      setHi(max != null ? String(max) : "");
    }
  }, [min, max]);

  const schedule = (nextLo: string, nextHi: string) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      const key = `${nextLo}|${nextHi}`;
      if (key === last.current) return;
      last.current = key;
      root.current?.closest("form")?.requestSubmit();
    }, 700);
  };

  const common = "field w-full py-2 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none";
  return (
    <div ref={root} className="flex items-center gap-2">
      <input
        name="min"
        type="number"
        min={0}
        inputMode="numeric"
        value={lo}
        placeholder={minLabel}
        aria-label={minLabel}
        onChange={(e) => {
          setLo(e.target.value);
          schedule(e.target.value, hi);
        }}
        className={common}
      />
      <span aria-hidden className="text-slate">
        –
      </span>
      <input
        name="max"
        type="number"
        min={0}
        inputMode="numeric"
        value={hi}
        placeholder={maxLabel}
        aria-label={maxLabel}
        onChange={(e) => {
          setHi(e.target.value);
          schedule(lo, e.target.value);
        }}
        className={common}
      />
    </div>
  );
}
