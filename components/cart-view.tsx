"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { setCartQuantityAction } from "@/app/actions/cart";
import { formatMoney, type Locale, type Money } from "@/lib/i18n";
import { QtyStepper } from "./qty-stepper";

export type CartLineView = {
  id: string;
  productId: number;
  name: string;
  sku: string;
  image?: string;
  href: string;
  unit?: Money;
  quantity: number;
};

type Labels = {
  sku: string;
  remove: string;
  subtotal: string;
  checkout: string;
  continueShopping: string;
  cartEmpty: string;
  updating: string;
  decreaseQty: string;
  increaseQty: string;
  qtyFor: string;
  lineTotal: string;
  error: string;
};

/**
 * The cart. Quantity changes update line totals and the subtotal immediately (optimistically), then save to
 * BigCommerce 500 ms after the last change. If the save fails the server's numbers are restored.
 */
export function CartView({ locale, lines: initial, subtotal, checkoutUrl, productsHref, labels }: { locale: Locale; lines: CartLineView[]; subtotal?: Money; checkoutUrl?: string; productsHref: string; labels: Labels }) {
  const router = useRouter();
  const [lines, setLines] = useState(initial);
  const [saving, setSaving] = useState(false);
  // False from the first change until fresh server data has arrived: the props hold the previous subtotal until then, so showing
  // them as soon as the save ends would flash the old total before the new one.
  const [synced, setSynced] = useState(true);
  const [failed, setFailed] = useState(false);
  const timers = useRef(new Map<string, ReturnType<typeof setTimeout>>());
  const inFlight = useRef(0);

  // Show the server's truth whenever nothing is waiting to be saved.
  useEffect(() => {
    if (timers.current.size === 0 && inFlight.current === 0) {
      setLines(initial);
      setSynced(true);
    }
  }, [initial, subtotal]);

  const change = (line: CartLineView, quantity: number) => {
    setFailed(false);
    setSaving(true);
    setSynced(false);
    setLines((ls) => (quantity <= 0 ? ls.filter((l) => l.id !== line.id) : ls.map((l) => (l.id === line.id ? { ...l, quantity } : l))));

    clearTimeout(timers.current.get(line.id));
    timers.current.set(
      line.id,
      setTimeout(
        async () => {
          timers.current.delete(line.id);
          inFlight.current++;
          const res = await setCartQuantityAction(line.id, line.productId, quantity);
          inFlight.current--;
          if (!res.ok) setFailed(true);
          if (timers.current.size === 0 && inFlight.current === 0) {
            setSaving(false);
            router.refresh(); // reload server truth (and the header badge)
          }
        },
        quantity <= 0 ? 0 : 500,
      ),
    );
  };

  const currency = lines[0]?.unit?.currencyCode ?? subtotal?.currencyCode ?? "GBP";
  const computed: Money = { value: lines.reduce((sum, l) => sum + (l.unit?.value ?? 0) * l.quantity, 0), currencyCode: currency };
  const shownSubtotal = synced && !saving && subtotal ? subtotal : computed;

  if (lines.length === 0) {
    return (
      <div className="mt-8 space-y-6">
        <p className="text-lg text-slate">{labels.cartEmpty}</p>
        <Link href={productsHref} className="btn btn-primary">
          {labels.continueShopping}
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-10 grid gap-14 lg:grid-cols-[1fr_21rem]">
      <ul className="divide-y divide-line border-y border-line">
        {lines.map((l) => (
          <li key={l.id} className="grid grid-cols-[5.5rem_1fr] gap-x-5 gap-y-3 py-6 sm:grid-cols-[6rem_1fr_auto]">
            <Link href={l.href} className="row-span-2 h-[5.5rem] w-[5.5rem] shrink-0 overflow-hidden rounded-[4px] bg-bench sm:row-span-1 sm:h-24 sm:w-24">
              {l.image && <Image src={l.image} alt="" width={192} height={192} className="h-full w-full object-contain p-2 mix-blend-multiply" />}
            </Link>

            <div className="flex min-w-0 flex-col gap-1">
              <Link href={l.href} className="font-semibold leading-snug hover:underline hover:decoration-amber hover:decoration-2">
                {l.name}
              </Link>
              <span className="text-sm text-slate">
                {labels.sku} {l.sku}
                {l.unit && <span className="ml-3">{formatMoney(locale, l.unit)}</span>}
              </span>
              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2">
                <QtyStepper
                  value={l.quantity}
                  onChange={(n) => change(l, n)}
                  label={labels.qtyFor.replace("{name}", l.name)}
                  decreaseLabel={labels.decreaseQty}
                  increaseLabel={labels.increaseQty}
                />
                <button
                  type="button"
                  onClick={() => change(l, 0)}
                  className="text-sm font-medium underline decoration-line decoration-2 underline-offset-4 hover:decoration-amber"
                >
                  {labels.remove}
                </button>
              </div>
            </div>

            <div className="col-span-2 flex items-baseline justify-between sm:col-span-1 sm:block sm:text-right">
              <span className="text-sm text-slate sm:hidden">{labels.lineTotal}</span>
              <span className="text-lg font-bold tabular-nums">{l.unit ? formatMoney(locale, { ...l.unit, value: l.unit.value * l.quantity }) : ""}</span>
            </div>
          </li>
        ))}
      </ul>

      <aside className="h-fit space-y-5 rounded-[4px] bg-bench p-6 lg:sticky lg:top-6">
        <div className="flex items-baseline justify-between">
          <span className="text-slate">{labels.subtotal}</span>
          <span className="font-display text-3xl font-extrabold tabular-nums [font-stretch:88%]">{formatMoney(locale, shownSubtotal)}</span>
        </div>
        <p aria-live="polite" className="min-h-5 text-sm">
          {failed ? <span className="font-medium text-red-700">{labels.error}</span> : saving ? <span className="text-slate">{labels.updating}</span> : null}
        </p>
        {checkoutUrl && (
          <a href={checkoutUrl} aria-disabled={saving} className={`btn btn-primary w-full py-3.5 ${saving ? "pointer-events-none opacity-60" : ""}`}>
            {labels.checkout}
          </a>
        )}
        <Link href={productsHref} className="block text-center text-sm font-medium underline decoration-line decoration-2 underline-offset-4 hover:decoration-amber">
          {labels.continueShopping}
        </Link>
      </aside>
    </div>
  );
}
