"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Search-as-you-type. Submits the surrounding form 350 ms after typing stops, but only for 3+ characters
 * (or when cleared). When the search is removed elsewhere (a filter chip, "Clear all") the text resets.
 */
export function SearchBox({ name, value, placeholder, label, hint, clearLabel }: { name: string; value?: string; placeholder: string; label: string; hint: string; clearLabel: string }) {
  const [text, setText] = useState(value ?? "");
  const lastSubmitted = useRef(value ?? "");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const input = useRef<HTMLInputElement>(null);

  // Follow the URL when the search was changed by something other than typing.
  useEffect(() => {
    if ((value ?? "") !== lastSubmitted.current) {
      lastSubmitted.current = value ?? "";
      setText(value ?? "");
    }
  }, [value]);

  const trimmed = text.trim();
  const tooShort = trimmed.length > 0 && trimmed.length < 3;

  const schedule = (next: string) => {
    clearTimeout(timer.current);
    const t = next.trim();
    if (t.length !== 0 && t.length < 3) return;
    timer.current = setTimeout(() => {
      if (t === lastSubmitted.current) return;
      lastSubmitted.current = t;
      input.current?.form?.requestSubmit();
    }, 350);
  };

  return (
    <div>
      <label className="sr-only" htmlFor={`${name}-box`}>
        {label}
      </label>
      <div className="relative">
        <svg aria-hidden width="18" height="18" viewBox="0 0 20 20" className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate">
          <circle cx="8.5" cy="8.5" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <path d="M13 13l4.5 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        <input
          ref={input}
          id={`${name}-box`}
          name={name}
          type="search"
          autoComplete="off"
          value={text}
          placeholder={placeholder}
          onChange={(e) => {
            setText(e.target.value);
            schedule(e.target.value);
          }}
          onKeyDown={(e) => e.key === "Enter" && tooShort && e.preventDefault()}
          className="field w-full py-3 pl-11 pr-11 [&::-webkit-search-cancel-button]:hidden"
        />
        {text && (
          <button
            type="button"
            aria-label={clearLabel}
            onClick={() => {
              setText("");
              schedule("");
              input.current?.focus();
            }}
            className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-slate hover:bg-bench hover:text-ink"
          >
            <svg aria-hidden width="12" height="12" viewBox="0 0 12 12">
              <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>
      <p aria-live="polite" className="mt-1.5 min-h-5 text-sm text-slate">
        {tooShort ? hint : ""}
      </p>
    </div>
  );
}
