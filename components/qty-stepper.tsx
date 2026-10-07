"use client";

import { useState } from "react";

type Props = {
  value: number;
  min?: number;
  max?: number;
  onChange: (next: number) => void;
  label: string;
  decreaseLabel: string;
  increaseLabel: string;
};

/** Compact quantity chooser: − / typeable field / +. Typing commits on blur or Enter; the buttons commit at once. */
export function QtyStepper({ value, min = 1, max = 999, onChange, label, decreaseLabel, increaseLabel }: Props) {
  const [draft, setDraft] = useState<string | null>(null);
  const clamp = (n: number) => Math.min(max, Math.max(min, Math.floor(n)));

  const commit = (raw: string) => {
    setDraft(null);
    const n = parseInt(raw, 10);
    if (Number.isFinite(n) && clamp(n) !== value) onChange(clamp(n));
  };

  const btn =
    "flex h-11 w-11 items-center justify-center text-xl leading-none text-ink transition-colors hover:bg-bench disabled:cursor-not-allowed disabled:text-line disabled:hover:bg-transparent";

  return (
    <div className="inline-flex items-center overflow-hidden rounded-[4px] border-[1.5px] border-line focus-within:border-ink">
      <button type="button" aria-label={decreaseLabel} disabled={value <= min} onClick={() => onChange(clamp(value - 1))} className={btn}>
        <span aria-hidden>−</span>
      </button>
      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        aria-label={label}
        value={draft ?? String(value)}
        onChange={(e) => setDraft(e.target.value.replace(/[^0-9]/g, ""))}
        onFocus={(e) => e.currentTarget.select()}
        onBlur={(e) => commit(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            commit(e.currentTarget.value);
            e.currentTarget.blur();
          }
          if (e.key === "ArrowUp") {
            e.preventDefault();
            onChange(clamp(value + 1));
          }
          if (e.key === "ArrowDown") {
            e.preventDefault();
            onChange(clamp(value - 1));
          }
        }}
        className="h-11 w-14 bg-transparent text-center text-base font-semibold tabular-nums outline-none"
      />
      <button type="button" aria-label={increaseLabel} disabled={value >= max} onClick={() => onChange(clamp(value + 1))} className={btn}>
        <span aria-hidden>+</span>
      </button>
    </div>
  );
}
