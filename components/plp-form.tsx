"use client";

import { useRouter } from "next/navigation";
import { useTransition, type ReactNode } from "react";

/**
 * The listing's filter form. Any change (checkbox, sort, search, price) re-runs the query by navigating to the
 * matching URL without a full reload and without jumping the scroll position. The results dim while loading.
 * Without JavaScript it is a normal GET form, so every state stays a shareable, crawlable URL.
 */
export function PlpForm({ action, children, className }: { action: string; children: ReactNode; className?: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();

  const submit = (form: HTMLFormElement) => {
    const params = new URLSearchParams();
    new FormData(form).forEach((v, k) => {
      if (typeof v === "string" && v.trim() !== "") params.append(k, v.trim());
    });
    const q = params.get("q");
    if (q && q.length < 3) params.delete("q"); // search needs 3+ characters
    if (params.get("sort") === "featured") params.delete("sort"); // the default
    const qs = params.toString();
    start(() => router.push(qs ? `${action}?${qs}` : action, { scroll: false }));
  };

  return (
    <form
      action={action}
      method="get"
      data-pending={pending}
      aria-busy={pending}
      className={`group ${className ?? ""}`}
      onSubmit={(e) => {
        e.preventDefault();
        submit(e.currentTarget);
      }}
      onChange={(e) => {
        const target = e.target as unknown as HTMLInputElement;
        if (target.type === "checkbox") submit(e.currentTarget);
      }}
    >
      {children}
    </form>
  );
}
