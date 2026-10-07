"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { addToCartAction } from "@/app/actions/cart";

type Labels = {
  quantity: string;
  addToCart: string;
  adding: string;
  addedToCart: string;
  viewCart: string;
  error: string;
  outOfStock: string;
};

export function AddToCart({
  productId,
  inStock,
  min = 1,
  max,
  cartHref,
  labels,
}: {
  productId: number;
  inStock: boolean;
  min?: number;
  max?: number;
  cartHref: string;
  labels: Labels;
}) {
  const [qty, setQty] = useState(min);
  const [pending, start] = useTransition();
  const [state, setState] = useState<"idle" | "added" | "error">("idle");

  const clamp = (n: number) => Math.min(max ?? 999, Math.max(min, Number.isFinite(n) ? n : min));

  if (!inStock) {
    return <p className="rounded-[4px] bg-bench px-4 py-3 text-sm font-semibold">{labels.outOfStock}</p>;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-end gap-3">
        <label className="text-sm">
          <span className="mb-1 block text-sm text-slate">{labels.quantity}</span>
          <div className="flex items-center rounded-[4px] border-[1.5px] border-line focus-within:border-ink">
            <button type="button" className="px-3 py-2" aria-label="−" onClick={() => setQty(clamp(qty - 1))}>
              −
            </button>
            <input
              type="number"
              inputMode="numeric"
              min={min}
              max={max}
              value={qty}
              onChange={(e) => setQty(clamp(parseInt(e.target.value, 10)))}
              className="w-14 bg-transparent py-2 text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
            />
            <button type="button" className="px-3 py-2" aria-label="+" onClick={() => setQty(clamp(qty + 1))}>
              +
            </button>
          </div>
        </label>
        <button
          type="button"
          disabled={pending}
          onClick={() =>
            start(async () => {
              setState("idle");
              const res = await addToCartAction(productId, qty);
              setState(res.ok ? "added" : "error");
            })
          }
          className="btn btn-primary flex-1 py-3.5"
        >
          {pending ? labels.adding : labels.addToCart}
        </button>
      </div>

      <div aria-live="polite" className="min-h-6 text-sm">
        {state === "added" && (
          <p className="flex items-center gap-3 font-medium text-stock">
            <span>✓ {labels.addedToCart}</span>
            <Link href={cartHref} className="text-ink underline decoration-amber decoration-2">
              {labels.viewCart}
            </Link>
          </p>
        )}
        {state === "error" && <p className="font-medium text-red-700">{labels.error}</p>}
      </div>
    </div>
  );
}
