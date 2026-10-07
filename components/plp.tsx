import Link from "next/link";
import type { CatalogResult, SortKey } from "@/lib/bigcommerce";
import { SORT_KEYS } from "@/lib/bigcommerce";
import { fill, formatMoney, getMessages, localePath, translateSpec, type Locale } from "@/lib/i18n";
import { FiltersDetails } from "./filters-details";
import { Pager } from "./pager";
import { PlpForm } from "./plp-form";
import { PriceRange } from "./price-range";
import { ProductCard } from "./product-card";
import { SearchBox } from "./search-box";
import { SortSelect } from "./sort-select";

type Params = { q?: string; brandIds: number[]; attrs: Record<string, string[]>; min?: number; max?: number; sort: SortKey };

/**
 * Product listing: search, active-filter chips, sort, brand / attribute / price facets (all from BigCommerce)
 * and the product grid. Filters apply as you click; every state is a shareable URL.
 */
export function Plp({ locale, basePath, result, params }: { locale: Locale; basePath: string; result: CatalogResult; params: Params }) {
  const t = getMessages(locale);
  const here = localePath(locale, basePath);
  const sortLabel: Record<SortKey, string> = {
    featured: t.sortFeatured,
    newest: t.sortNewest,
    best_selling: t.sortBestSelling,
    price_asc: t.sortPriceAsc,
    price_desc: t.sortPriceDesc,
    name_asc: t.sortNameAsc,
  };

  /** Builds this page's URL from the current parameters after `edit` has changed them (cursors always reset). */
  const href = (edit: (qs: URLSearchParams) => void, keepCursor?: Record<string, string | undefined>) => {
    const qs = new URLSearchParams();
    if (params.q) qs.set("q", params.q);
    params.brandIds.forEach((b) => qs.append("brand", String(b)));
    Object.entries(params.attrs).forEach(([n, vs]) => vs.forEach((v) => qs.append(`f.${n}`, v)));
    if (params.min != null) qs.set("min", String(params.min));
    if (params.max != null) qs.set("max", String(params.max));
    if (params.sort !== "featured") qs.set("sort", params.sort);
    edit(qs);
    for (const [k, v] of Object.entries(keepCursor ?? {})) if (v) qs.set(k, v);
    const s = qs.toString();
    return s ? `${here}?${s}` : here;
  };
  const removeParam = (key: string, value?: string) => (qs: URLSearchParams) => {
    const keep = qs.getAll(key).filter((v) => value !== undefined && v !== value);
    qs.delete(key);
    keep.forEach((v) => qs.append(key, v));
  };

  // Active filters as removable chips. A search term is a filter like any other.
  const currency = result.products[0]?.price?.currencyCode ?? "GBP";
  const money = (n: number) => formatMoney(locale, { value: n, currencyCode: currency });
  const chips: { key: string; label: string; remove: string }[] = [];
  if (params.q) chips.push({ key: "q", label: `“${params.q}”`, remove: href(removeParam("q")) });
  for (const id of params.brandIds) {
    const name = result.brands.find((b) => b.id === id)?.name ?? String(id);
    chips.push({ key: `b${id}`, label: `${t.filterBrand}: ${name}`, remove: href((qs) => removeParam("brand", String(id))(qs)) });
  }
  for (const [name, values] of Object.entries(params.attrs)) {
    for (const v of values) {
      const tr = translateSpec(locale, name, v);
      const label = translateSpec(locale, name, "").name;
      chips.push({ key: `${name}:${v}`, label: `${label}: ${tr.value}`, remove: href(removeParam(`f.${name}`, v)) });
    }
  }
  if (params.min != null || params.max != null) {
    const label =
      params.min != null && params.max != null
        ? `${money(params.min)} – ${money(params.max)}`
        : params.min != null
          ? fill(t.priceFrom, { min: money(params.min) })
          : fill(t.priceUpTo, { max: money(params.max!) });
    chips.push({ key: "price", label: `${t.filterPrice}: ${label}`, remove: href((qs) => { qs.delete("min"); qs.delete("max"); }) });
  }
  const clearHref = params.sort !== "featured" ? `${here}?sort=${params.sort}` : here;

  return (
    <PlpForm action={here} className="mt-10">
      <div className="max-w-2xl">
        <SearchBox name="q" value={params.q} placeholder={t.searchProducts} label={t.searchProducts} hint={t.typeMore} clearLabel={t.searchClear} />
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-b border-line pb-4">
        <div className="flex flex-wrap items-center gap-2">
          <p className="mr-2 font-semibold">{result.total === 1 ? t.showingCountOne : fill(t.showingCount, { count: result.total })}</p>
          {chips.map((c) => (
            <Link
              key={c.key}
              href={c.remove}
              scroll={false}
              aria-label={fill(t.removeFilter, { name: c.label })}
              className="group/chip inline-flex items-center gap-2 rounded-full bg-bench py-1.5 pl-3.5 pr-2.5 text-sm font-medium hover:bg-line"
            >
              {c.label}
              <svg aria-hidden width="10" height="10" viewBox="0 0 12 12" className="text-slate group-hover/chip:text-ink">
                <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </Link>
          ))}
          {chips.length > 0 && (
            <Link href={clearHref} scroll={false} className="ml-1 text-sm font-semibold underline decoration-amber decoration-2 underline-offset-4">
              {t.clearAll}
            </Link>
          )}
        </div>
        <SortSelect name="sort" value={params.sort} label={t.sortBy} options={SORT_KEYS.map((k) => ({ value: k, label: sortLabel[k] }))} />
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[14rem_1fr]">
        <aside>
          <FiltersDetails className="lg:[&>summary]:hidden">
            <summary className="mb-4 cursor-pointer list-none rounded-[4px] border-[1.5px] border-line px-4 py-2.5 font-semibold lg:border-0 lg:p-0">
              {t.filters}
            </summary>
            <div className="space-y-8">
              {result.brands.length > 0 && (
                <fieldset>
                  <legend className="mb-3 font-semibold">{t.filterBrand}</legend>
                  <ul className="space-y-2">
                    {result.brands.map((b) => {
                      const checked = params.brandIds.includes(b.id);
                      return (
                        <li key={`${b.id}-${checked}`}>
                          <label className="flex cursor-pointer items-center gap-2.5 text-[0.95rem]">
                            <input type="checkbox" name="brand" value={b.id} defaultChecked={checked} className="h-4 w-4 accent-[#0f1b26]" />
                            <span className="flex-1">{b.name}</span>
                            <span className="text-sm text-slate">{b.count}</span>
                          </label>
                        </li>
                      );
                    })}
                  </ul>
                </fieldset>
              )}

              {result.facets.map((f) => (
                <fieldset key={f.name}>
                  <legend className="mb-3 font-semibold">{translateSpec(locale, f.name, "").name}</legend>
                  <ul className="space-y-2">
                    {f.values.map((v) => {
                      const checked = (params.attrs[f.name] ?? []).includes(v.value);
                      return (
                        <li key={`${v.value}-${checked}`}>
                          <label className="flex cursor-pointer items-center gap-2.5 text-[0.95rem]">
                            <input type="checkbox" name={`f.${f.name}`} value={v.value} defaultChecked={checked} className="h-4 w-4 accent-[#0f1b26]" />
                            <span className="flex-1">{translateSpec(locale, f.name, v.value).value}</span>
                            <span className="text-sm text-slate">{v.count}</span>
                          </label>
                        </li>
                      );
                    })}
                  </ul>
                </fieldset>
              ))}

              <fieldset>
                <legend className="mb-3 font-semibold">{t.filterPrice}</legend>
                <PriceRange min={params.min} max={params.max} minLabel={t.priceMin} maxLabel={t.priceMax} />
              </fieldset>

              {/* Without JavaScript the form needs an explicit submit. */}
              <noscript>
                <button className="btn btn-outline px-4 py-2.5">{t.applyFilters}</button>
              </noscript>
            </div>
          </FiltersDetails>
        </aside>

        <div className="transition-opacity duration-200 group-data-[pending=true]:opacity-50">
          {result.products.length ? (
            <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
              {result.products.map((p) => (
                <ProductCard key={p.entityId} product={p} locale={locale} />
              ))}
            </div>
          ) : (
            <p className="text-slate">{t.noResults}</p>
          )}
          <Pager
            prevHref={result.hasPrev ? href(() => {}, { before: result.startCursor }) : undefined}
            nextHref={result.hasNext ? href(() => {}, { after: result.endCursor }) : undefined}
            previous={t.previous}
            next={t.next}
          />
        </div>
      </div>
    </PlpForm>
  );
}
