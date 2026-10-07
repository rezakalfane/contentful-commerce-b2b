"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { LANGUAGE_NAME, LOCALES, localeOfCatalogRoot, localePath, stripLocale, type Locale } from "@/lib/i18n";

/**
 * Links to the same page in every locale. Most pages share their path, so only the prefix changes. Catalog pages have translated
 * URLs (/products/..., /fr/produits/...), so their link goes through /api/switch-locale, which finds the page's path in the
 * other language. Filter values are translated too, so attribute filters (`f.*`) are not carried across.
 */
export function LocaleSwitcher({ locale, label }: { locale: Locale; label: string }) {
  const pathname = usePathname();
  const params = useSearchParams();
  const base = stripLocale(pathname);
  const segments = base.split("/").filter(Boolean);
  const inCatalog = Boolean(segments[0] && localeOfCatalogRoot(segments[0]));
  const carried = new URLSearchParams([...params.entries()].filter(([k]) => !(inCatalog && k.startsWith("f."))));
  const q = carried.toString();

  const hrefFor = (l: Locale) => {
    if (l === locale) return pathname + (params.toString() ? `?${params.toString()}` : "");
    if (inCatalog && segments.length > 1) {
      const to = new URLSearchParams({ to: l, path: pathname });
      carried.forEach((v, k) => to.append(k, v));
      return `/api/switch-locale?${to.toString()}`;
    }
    return localePath(l, inCatalog ? "/products" : base) + (q ? `?${q}` : "");
  };

  return (
    <ul className="flex items-center text-[0.95rem]" aria-label={label}>
      {LOCALES.map((l, i) => (
        <li key={l} className={i > 0 ? "ml-2 border-l border-line pl-2" : ""}>
          <Link
            href={hrefFor(l)}
            prefetch={false}
            hrefLang={l}
            lang={l}
            aria-current={l === locale ? "true" : undefined}
            className={
              l === locale
                ? "font-semibold underline decoration-amber decoration-2 underline-offset-4"
                : "text-slate hover:text-ink"
            }
          >
            {l.toUpperCase()}
            <span className="sr-only"> {LANGUAGE_NAME[l]}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
